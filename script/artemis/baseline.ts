import path from "node:path"
import os from "node:os"
import fs from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { root, environment, freeModels, selectModel, configuration, isolatedEnvironment, cli, redact } from "./runtime"
import { run } from "./process"

async function main() {
  const mode = process.argv[2]
  if (!["--prepare", "--models", "--run"].includes(mode ?? "")) {
    console.error("Usage: bun run script/artemis/baseline.ts --prepare | --models | --run")
    return 2
  }
  const base = await environment()
  if (mode === "--models") {
    console.log((await freeModels()).map((model) => model.id).join("\n"))
    return 0
  }
  if (mode === "--run" && !base.OPENROUTER_API_KEY) throw new Error("Configurez OPENROUTER_API_KEY dans .env.local.")
  const workspace = await fs.mkdtemp(path.join(os.tmpdir(), "artemis-baseline-"))
  const output = path.join(root, ".artemis-local/evals", path.basename(workspace))
  await fs.mkdir(output, { recursive: true })
  const report: Record<string, unknown> = {
    status: "running",
    stage: "preparation",
    workspace,
    startedAt: new Date().toISOString(),
  }
  const save = () => Bun.write(path.join(output, "report.json"), JSON.stringify(report, null, 2))
  await save()
  console.log(`Rapport : ${output}`)
  const code = await execute().catch((error: unknown) => {
    report.status = "failed"
    report.error = redact(error instanceof Error ? error.message : String(error), base.OPENROUTER_API_KEY)
    console.error(report.error)
    return 1
  })
  report.finishedAt = new Date().toISOString()
  await save()
  console.log(`Résultat : ${report.status}`)
  return code

  async function execute() {
    const revision = await run(["git", "rev-parse", "HEAD"], { cwd: root })
    if (revision.code !== 0) throw new Error(revision.stderr)
    report.revision = revision.stdout.trim()
    await fs.cp(path.join(root, "evals/fixtures/cart"), workspace, { recursive: true })
    const original = await Bun.file(path.join(workspace, "cart.test.mjs")).text()
    const verifier = path.join(output, "verify.test.mjs")
    await Bun.write(
      verifier,
      original.replace('"./cart.mjs"', JSON.stringify(pathToFileURL(path.join(workspace, "cart.mjs")).href)),
    )
    const before = await run(["node", "--test", "--test-reporter=tap"], {
      cwd: workspace,
      log: path.join(output, "before.txt"),
    })
    if (before.code !== 1 || !before.stdout.includes("Reduce of empty array") || !before.stdout.includes("# pass 2")) {
      throw new Error("La fixture n’échoue pas pour la raison attendue ; aucun appel modèle effectué.")
    }
    report.baselineFailsAsExpected = true
    const hooks = path.join(output, "empty-hooks")
    await fs.mkdir(hooks)
    for (const args of [
      ["init", "-q"],
      ["add", "."],
      [
        "-c",
        "user.name=Artemis Eval",
        "-c",
        "user.email=eval@localhost",
        "-c",
        `core.hooksPath=${hooks}`,
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-qm",
        "Baseline fixture",
      ],
    ]) {
      const result = await run(["git", ...args], { cwd: workspace })
      if (result.code !== 0) throw new Error(result.stderr)
    }
    if (mode === "--prepare") {
      report.status = "prepared"
      report.stage = "finished"
      return 0
    }
    report.stage = "catalog"
    await save()
    const model = selectModel(await freeModels(), base.ARTEMIS_MODEL)
    const env = await isolatedEnvironment(base, output, {
      ...configuration(model),
      snapshot: false,
      agent: { build: { steps: 8 } },
      permission: {
        "*": "deny",
        read: "allow",
        glob: "allow",
        grep: "allow",
        edit: { "*": "deny", "cart.mjs": "allow", [path.join(workspace, "cart.mjs")]: "allow" },
        bash: { "*": "deny", "node --test": "allow" },
      },
    })
    report.model = model.id
    report.stage = "agent"
    await save()
    console.log(`Modèle : ${model.id}\nProjet temporaire : ${workspace}\nLogs : ${path.join(output, "agent.log")}`)
    const start = Date.now()
    const result = await run(
      cli([
        "run",
        "--dir",
        workspace,
        "--format",
        "json",
        "--model",
        `openrouter/${model.id}`,
        "Lis cart.mjs et les tests. Corrige uniquement cart.mjs pour accepter un panier vide sans changer les autres résultats. Lance node --test. Ne modifie pas les tests et ne crée aucun autre fichier.",
      ]),
      { cwd: root, env, timeout: 300_000, log: path.join(output, "agent.log"), secret: base.OPENROUTER_API_KEY },
    )
    report.elapsedMs = Date.now() - start
    report.agentExitCode = result.code
    report.agentSignal = result.signal
    report.timedOut = result.timedOut
    report.interrupted = result.interrupted
    report.stage = "verification"
    await save()
    const events = result.stdout.split("\n").flatMap((line) => {
      try {
        const event: unknown = JSON.parse(line)
        return event && typeof event === "object" && "type" in event && event.type === "error" ? [event] : []
      } catch {
        return []
      }
    })
    report.agentErrors = events
    const unchanged =
      (await Bun.file(path.join(workspace, "cart.test.mjs"))
        .text()
        .catch(() => undefined)) === original
    const after = await run(["node", "--test", "--test-reporter=tap", verifier], {
      cwd: output,
      log: path.join(output, "after.txt"),
    })
    const diff = await run(["git", "diff", "--", "cart.mjs"], { cwd: workspace })
    const changed = await run(["git", "status", "--porcelain", "--untracked-files=all"], { cwd: workspace })
    await Bun.write(path.join(output, "changes.diff"), diff.stdout)
    const success =
      result.code === 0 &&
      !result.timedOut &&
      !result.interrupted &&
      !events.length &&
      after.code === 0 &&
      after.stdout.includes("# pass 3") &&
      unchanged &&
      diff.code === 0 &&
      changed.code === 0 &&
      changed.stdout.trim() === "M cart.mjs"
    report.status = result.interrupted ? "interrupted" : result.timedOut ? "timed_out" : success ? "passed" : "failed"
    report.stage = "finished"
    report.testsExitCode = after.code
    report.testsUnchanged = unchanged
    report.changedFiles = changed.stdout
    report.reportedCost = null
    report.note = "Coût non extrait ; catalogue gratuit vérifié avant exécution. Voir agent.log pour les événements."
    return result.interrupted ? 130 : success ? 0 : 1
  }
}

process.exitCode = await main().catch(async (error: unknown) => {
  console.error(
    redact(error instanceof Error ? error.message : String(error), (await environment()).OPENROUTER_API_KEY),
  )
  return 1
})
