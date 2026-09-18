import { expect, test } from "bun:test"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { configuration, isolatedEnvironment, selectModel } from "./runtime"
import { run } from "./process"

test("refuse un modèle absent du catalogue gratuit vérifié", () => {
  expect(() => selectModel([{ id: "code:free", context_length: 8192 }], "paid-model")).toThrow()
  expect(selectModel([{ id: "code:free", context_length: 8192 }], "openrouter/code:free").id).toBe("code:free")
})

test("isole la configuration sans écrire la clé", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "artemis-config-test-"))
  try {
    const env = await isolatedEnvironment(
      {
        OPENROUTER_API_KEY: "test-secret",
        OPENCODE_CONFIG_CONTENT: "inherited",
        OPENCODE_CONFIG_DIR: "/inherited",
        OPENCODE_TUI_CONFIG: "/inherited-tui.json",
        OPENCODE_PERMISSION: '{"*":"allow"}',
        OPENCODE_DB: "/inherited.db",
      },
      directory,
      configuration({ id: "code:free", context_length: 8192 }),
    )
    expect(env.OPENROUTER_API_KEY).toBe("test-secret")
    expect(env.OPENCODE_CONFIG_CONTENT).toBe("")
    expect(env.OPENCODE_CONFIG_DIR).toBe("")
    expect(env.OPENCODE_TUI_CONFIG).toBe("")
    expect(env.OPENCODE_PERMISSION).toBe("")
    expect(env.OPENCODE_DB).toBe("")
    expect(env.XDG_DATA_HOME).toBe(path.join(directory, "data"))
    expect(await Bun.file(env.OPENCODE_CONFIG).text()).not.toContain("test-secret")
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test("conserve les sorties et le code de retour", async () => {
  const result = await run([process.execPath, "-e", 'console.log("out"); console.error("err"); process.exit(3)'], {
    cwd: import.meta.dir,
  })
  expect(result.code).toBe(3)
  expect(result.stdout).toBe("out\n")
  expect(result.stderr).toBe("err\n")
})

test("masque une clé même coupée entre deux écritures", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "artemis-log-test-"))
  try {
    const log = path.join(directory, "agent.log")
    const result = await run(
      [
        process.execPath,
        "-e",
        'process.stdout.write("prefix secret-"); setTimeout(() => process.stdout.write("value suffix"), 100)',
      ],
      { cwd: directory, log, secret: "secret-value" },
    )
    expect(result.stdout).toBe("prefix [REDACTED] suffix")
    expect(await Bun.file(log).text()).toBe(result.stdout)
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})

test.skipIf(process.platform === "win32")("le délai arrête les descendants qui gardent les pipes ouverts", async () => {
  const start = Date.now()
  const result = await run(
    [
      process.execPath,
      "-e",
      'const {spawn} = require("node:child_process"); spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {stdio: ["ignore", 1, 2]}); console.log("ready"); process.exit(0)',
    ],
    { cwd: import.meta.dir, timeout: 700 },
  )
  expect(result.timedOut).toBe(true)
  expect(result.stdout).toContain("ready")
  expect(Date.now() - start).toBeLessThan(5000)
})
