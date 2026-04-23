import { spawn, type ChildProcess } from "node:child_process";

export class PreviewSupervisor {
  private proc: ChildProcess | null = null;
  private stopped = false;
  private restartAttempts = 0;

  constructor(
    private readonly cwd: string,
    private readonly port: number,
    private readonly host: string,
  ) {}

  start(): void {
    if (this.proc) return;
    this.stopped = false;
    this.spawn();
  }

  async stop(): Promise<void> {
    this.stopped = true;
    if (!this.proc) return;
    this.proc.kill("SIGTERM");
    this.proc = null;
  }

  isRunning(): boolean {
    return this.proc !== null && !this.proc.killed;
  }

  private spawn(): void {
    const child = spawn(
      "npx",
      ["next", "dev", "--port", String(this.port), "--hostname", this.host],
      {
        cwd: this.cwd,
        env: { ...process.env, NODE_ENV: "development" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    child.stdout?.on("data", (chunk) => {
      process.stdout.write(`[preview] ${chunk}`);
    });
    child.stderr?.on("data", (chunk) => {
      process.stderr.write(`[preview] ${chunk}`);
    });

    child.on("exit", (code, signal) => {
      console.warn(`[preview] exited code=${code} signal=${signal}`);
      this.proc = null;
      if (this.stopped) return;
      const delay = Math.min(30_000, 1000 * 2 ** this.restartAttempts);
      this.restartAttempts += 1;
      setTimeout(() => !this.stopped && this.spawn(), delay);
    });

    child.on("spawn", () => {
      this.restartAttempts = 0;
    });

    this.proc = child;
  }
}
