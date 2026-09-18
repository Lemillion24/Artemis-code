import path from "node:path"
import fs from "node:fs/promises"
import { parseEnv } from "node:util"

export const root = path.resolve(import.meta.dir, "../..")

export async function environment() {
  const local = Bun.file(path.join(root, ".env.local"))
  const values = (await local.exists()) ? parseEnv(await local.text()) : {}
  return {
    ...process.env,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || values.OPENROUTER_API_KEY || "",
    ARTEMIS_MODEL: process.env.ARTEMIS_MODEL || values.ARTEMIS_MODEL || "",
    PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ""}`,
  }
}

export type FreeModel = { id: string; context_length: number }

export async function freeModels(): Promise<FreeModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models", { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error(`Catalogue OpenRouter : HTTP ${response.status}`)
  const catalog: unknown = await response.json()
  if (!catalog || typeof catalog !== "object" || !("data" in catalog) || !Array.isArray(catalog.data)) {
    throw new Error("Catalogue OpenRouter invalide")
  }
  return catalog.data.filter(
    (item): item is FreeModel =>
      Boolean(item) &&
      typeof item.id === "string" &&
      item.id.endsWith(":free") &&
      Number.isInteger(item.context_length) &&
      item.context_length >= 4096 &&
      Array.isArray(item.supported_parameters) &&
      item.supported_parameters.includes("tools") &&
      item.pricing?.prompt === "0" &&
      item.pricing?.completion === "0" &&
      Object.values(item.pricing).every((value) => Number(value) === 0),
  )
}

export function selectModel(models: FreeModel[], requested: string) {
  const model = requested
    ? models.find((item) => item.id === requested.replace(/^openrouter\//, ""))
    : (models.find((item) => /code/i.test(item.id)) ?? models[0])
  if (!model) throw new Error("Aucun modèle gratuit avec outils ne correspond au choix demandé.")
  return model
}

// The current terminal and `run` command use the legacy config adapter.
// Credentials come from the provider's env integration, never from persisted JSON.
export function configuration(model: FreeModel) {
  return {
    model: `openrouter/${model.id}`,
    small_model: `openrouter/${model.id}`,
    enabled_providers: ["openrouter"],
    autoupdate: false,
    share: "disabled",
    plugin: [],
    provider: {
      openrouter: {
        npm: "@openrouter/ai-sdk-provider",
        api: "https://openrouter.ai/api/v1",
        env: ["OPENROUTER_API_KEY"],
        options: { timeout: 60_000, headerTimeout: 30_000, streamTimeout: 30_000 },
        models: {
          [model.id]: {
            id: model.id,
            name: model.id,
            tool_call: true,
            modalities: { input: ["text"], output: ["text"] },
            cost: { input: 0, output: 0 },
            limit: { context: model.context_length, output: 4096 },
            options: { provider: { require_parameters: true } },
          },
        },
      },
    },
  }
}

export async function isolatedEnvironment<T extends NodeJS.ProcessEnv>(base: T, directory: string, config: object) {
  const file = path.join(directory, "opencode.json")
  await fs.mkdir(directory, { recursive: true })
  await Bun.write(file, JSON.stringify(config, null, 2))
  return {
    ...base,
    XDG_DATA_HOME: path.join(directory, "data"),
    XDG_CONFIG_HOME: path.join(directory, "config"),
    XDG_CACHE_HOME: path.join(directory, "cache"),
    XDG_STATE_HOME: path.join(directory, "state"),
    OPENCODE_CONFIG: file,
    OPENCODE_CONFIG_CONTENT: "",
    OPENCODE_CONFIG_DIR: "",
    OPENCODE_TUI_CONFIG: "",
    OPENCODE_PERMISSION: "",
    OPENCODE_DB: "",
    OPENCODE_DISABLE_PROJECT_CONFIG: "true",
    OPENCODE_DISABLE_AUTOUPDATE: "true",
    OPENCODE_DISABLE_MODELS_FETCH: "true",
    OPENCODE_TEST_HOME: path.join(directory, "home"),
    OPENCODE_TEST_MANAGED_CONFIG_DIR: path.join(directory, "managed"),
  }
}

export function cli(args: string[]) {
  return [process.execPath, "run", "--cwd", path.join(root, "packages/opencode"), "src/index.ts", ...args]
}

export function redact(value: string, secret: string) {
  return secret ? value.replaceAll(secret, "[REDACTED]") : value
}
