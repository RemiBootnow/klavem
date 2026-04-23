import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, symlinkSync } from "node:fs";
import path from "node:path";

const execFileP = promisify(execFile);

export class Git {
  constructor(
    private readonly mainRepo: string,
    private readonly worktreePath: string,
    private readonly draftBranch: string,
    private readonly mainBranch: string,
  ) {}

  private async runIn(cwd: string, args: string[]) {
    const { stdout, stderr } = await execFileP("git", args, { cwd });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  async ensureWorktree(): Promise<void> {
    if (existsSync(path.join(this.worktreePath, ".git"))) {
      this.linkNodeModules();
      return;
    }

    await this.runIn(this.mainRepo, ["fetch", "origin"]).catch(() => {
      console.warn("[git] no remote configured; skipping fetch");
    });

    const branches = await this.runIn(this.mainRepo, ["branch", "--list", this.draftBranch]);
    const draftExists = branches.stdout.length > 0;

    if (!draftExists) {
      await this.runIn(this.mainRepo, [
        "branch",
        this.draftBranch,
        this.mainBranch,
      ]);
    }

    await this.runIn(this.mainRepo, [
      "worktree",
      "add",
      this.worktreePath,
      this.draftBranch,
    ]);

    await this.seedFromMainWorkingTree();
    this.linkNodeModules();
  }

  private async seedFromMainWorkingTree(): Promise<void> {
    const excludes = [
      ".git",
      ".git/",
      "node_modules",
      "node_modules/",
      ".next",
      ".next/",
      "dist",
      "dist/",
      ".env",
      ".env.*",
      "*.log",
      ".DS_Store",
      "editor-server",
      "editor-ui",
      "klavem-draft",
    ];
    const args = [
      "-a",
      ...excludes.flatMap((e) => ["--exclude", e]),
      `${this.mainRepo}/`,
      `${this.worktreePath}/`,
    ];
    try {
      await execFileP("rsync", args);
      console.log("[git] seeded worktree from main working tree");
    } catch (err) {
      console.warn(`[git] rsync seed failed: ${err}`);
    }
  }

  private linkNodeModules() {
    const target = path.join(this.worktreePath, "node_modules");
    if (existsSync(target)) return;
    const source = path.join(this.mainRepo, "node_modules");
    if (!existsSync(source)) {
      console.warn("[git] main repo has no node_modules to link");
      return;
    }
    try {
      symlinkSync(source, target, "dir");
      console.log(`[git] linked node_modules into worktree`);
    } catch (err) {
      console.warn(`[git] could not link node_modules: ${err}`);
    }
  }

  async status(): Promise<{ dirty: boolean; files: string[] }> {
    const { stdout } = await this.runIn(this.worktreePath, [
      "status",
      "--porcelain",
    ]);
    const files = stdout.split("\n").filter(Boolean).map((l) => l.slice(3));
    return { dirty: files.length > 0, files };
  }

  async commitAll(message: string): Promise<{ committed: boolean; sha?: string }> {
    const { dirty } = await this.status();
    if (!dirty) return { committed: false };

    await this.runIn(this.worktreePath, ["add", "-A"]);
    await this.runIn(this.worktreePath, ["commit", "-m", message]);
    const { stdout } = await this.runIn(this.worktreePath, [
      "rev-parse",
      "HEAD",
    ]);
    return { committed: true, sha: stdout };
  }

  async publish(): Promise<{ sha: string }> {
    const { stdout: sha } = await this.runIn(this.worktreePath, [
      "rev-parse",
      this.draftBranch,
    ]);
    await this.runIn(this.mainRepo, [
      "push",
      "origin",
      `${this.draftBranch}:${this.mainBranch}`,
    ]);
    return { sha };
  }

  async resetDraftToMain(): Promise<void> {
    const hasRemote = await this.runIn(this.mainRepo, [
      "remote",
    ]).then((r) => r.stdout.length > 0).catch(() => false);

    if (hasRemote) {
      await this.runIn(this.mainRepo, ["fetch", "origin", this.mainBranch]);
      await this.runIn(this.worktreePath, [
        "reset",
        "--hard",
        `origin/${this.mainBranch}`,
      ]);
    } else {
      await this.runIn(this.worktreePath, [
        "reset",
        "--hard",
        this.mainBranch,
      ]);
    }
  }

  async diffSummary(): Promise<string> {
    const hasRemote = await this.runIn(this.mainRepo, [
      "remote",
    ]).then((r) => r.stdout.length > 0).catch(() => false);
    const base = hasRemote ? `origin/${this.mainBranch}` : this.mainBranch;
    const { stdout } = await this.runIn(this.worktreePath, [
      "diff",
      `${base}...HEAD`,
      "--stat",
    ]);
    return stdout;
  }
}
