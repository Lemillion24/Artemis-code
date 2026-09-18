import path from "node:path"
import fs from "node:fs/promises"
import { root, environment, freeModels, selectModel, configuration, isolatedEnvironment, cli, redact } from "./runtime"

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Usage: bun run script/artemis/dev.ts [chemin du projet] [--check]")
    return 0
  }
  const args = process.argv.slice(2).filter((arg) => arg !== "--check")
  if (args.length > 1) throw new Error("Un seul chemin de projet est accepté.")
  const directory = path.resolve(args[0] ?? root)
  if (!(await fs.stat(directory)).isDirectory()) throw new Error("Le projet doit être un dossier.")
  const base = await environment()
  if (!base.OPENROUTER_API_KEY) throw new Error("Configurez OPENROUTER_API_KEY dans .env.local.")
  const model = selectModel(await freeModels(), base.ARTEMIS_MODEL)
  const config = configuration(model)
  const env = await isolatedEnvironment(base, path.join(root, ".artemis-local/runtime"), {
    ...config,
    permission: { "*": "ask", read: "allow", glob: "allow", grep: "allow" },
  })
  console.log(`Projet : ${directory}\nModèle : ${model.id}\nDonnées : ${env.XDG_DATA_HOME}`)
  if (process.argv.includes("--check")) return 0
  const child = Bun.spawn(cli([directory, "--model", `openrouter/${model.id}`]), {
    cwd: root,
    env: { ...env, PWD: directory },
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  })
  const stop = () => child.kill("SIGTERM")
  process.on("SIGINT", stop)
  process.on("SIGTERM", stop)
  const code = await child.exited
  process.off("SIGINT", stop)
  process.off("SIGTERM", stop)
  return code
}

process.exitCode = await main().catch(async (error: unknown) => {
  console.error(
    redact(error instanceof Error ? error.message : String(error), (await environment()).OPENROUTER_API_KEY),
  )
  return 1
})
