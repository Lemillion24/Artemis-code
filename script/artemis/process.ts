import { spawn } from "node:child_process"
import { createWriteStream } from "node:fs"
import { redact } from "./runtime"

export function run(
  cmd: string[],
  options: {
    cwd: string
    env?: NodeJS.ProcessEnv
    timeout?: number
    log?: string
    secret?: string
  },
) {
  return new Promise<{
    code: number | null
    signal: NodeJS.Signals | null
    timedOut: boolean
    interrupted: boolean
    stdout: string
    stderr: string
  }>((resolve) => {
    const state = { timedOut: false, interrupted: false, stdout: "", stderr: "" }
    const log = options.log ? createWriteStream(options.log, { mode: 0o600 }) : undefined
    const child = spawn(cmd[0]!, cmd.slice(1), {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    })
    const kill = (signal: NodeJS.Signals) => {
      if (!child.pid) return
      if (process.platform === "win32") {
        spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" })
        return
      }
      // Each child owns a process group. Include descendants that inherited pipes.
      try {
        process.kill(-child.pid, signal)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error
      }
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    const stop = () => {
      kill("SIGTERM")
      timers.push(setTimeout(() => kill("SIGKILL"), 1000))
    }
    const interrupt = () => {
      state.interrupted = true
      stop()
    }
    process.on("SIGINT", interrupt)
    process.on("SIGTERM", interrupt)
    timers.push(
      setTimeout(() => {
        state.timedOut = true
        stop()
      }, options.timeout ?? 30_000),
    )
    const capture = (stream: typeof child.stdout, field: "stdout" | "stderr") => {
      // Hold a trailing fragment so a secret split across chunks is also redacted.
      const buffer = { value: "" }
      const length = Math.max(1, options.secret?.length ?? 0)
      stream.setEncoding("utf8")
      stream.on("data", (chunk: string) => {
        buffer.value = redact(buffer.value + chunk, options.secret ?? "")
        const end = Math.max(0, buffer.value.length - length)
        const safe = buffer.value.slice(0, end)
        buffer.value = buffer.value.slice(end)
        state[field] += safe
        log?.write(safe)
      })
      stream.on("end", () => {
        state[field] += buffer.value
        log?.write(buffer.value)
      })
    }
    capture(child.stdout, "stdout")
    capture(child.stderr, "stderr")
    child.on("error", (error) => {
      state.stderr += redact(error.message, options.secret ?? "")
    })
    child.on("close", (code, signal) => {
      // A descendant can close its pipes while still running. Clean the group on cancellation.
      if (state.timedOut || state.interrupted) kill("SIGKILL")
      timers.forEach(clearTimeout)
      process.off("SIGINT", interrupt)
      process.off("SIGTERM", interrupt)
      const finish = () => resolve({ ...state, code, signal })
      if (log) {
        log.end(finish)
        return
      }
      finish()
    })
  })
}
