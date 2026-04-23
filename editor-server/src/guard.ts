import path from "node:path";
import { minimatch } from "minimatch";

const FILE_WRITE_TOOLS = new Set(["Write", "Edit", "MultiEdit", "NotebookEdit"]);
const FILE_READ_TOOLS = new Set(["Read", "Glob", "Grep", "LS"]);

const WRITE_ALLOWLIST = [
  "content/**",
  "public/vehicules/**",
  "public/home/**",
  "public/testimonials/**",
  "src/components/sections/**",
  "src/components/blocks/**",
  "src/app/globals.css",
  "src/app/page.tsx",
  "src/app/vehicules/**",
];

const BASH_ALLOWLIST: RegExp[] = [
  /^git status(\s|$)/,
  /^git diff(\s|$)/,
  /^git log(\s|$)/,
  /^npm run generate:vehicle-images(\s|$)/,
  /^ls(\s|$)/,
  /^pwd$/,
];

export type GuardDecision =
  | { allow: true }
  | { allow: false; reason: string };

export function checkToolCall(args: {
  toolName: string;
  toolInput: Record<string, unknown>;
  worktreeRoot: string;
}): GuardDecision {
  const { toolName, toolInput, worktreeRoot } = args;

  if (FILE_READ_TOOLS.has(toolName)) return { allow: true };

  if (FILE_WRITE_TOOLS.has(toolName)) {
    const filePath = toolInput.file_path as string | undefined;
    if (!filePath) {
      return { allow: false, reason: `${toolName} called without file_path` };
    }
    return checkPath(filePath, worktreeRoot);
  }

  if (toolName === "Bash") {
    const command = (toolInput.command as string | undefined)?.trim() ?? "";
    if (!BASH_ALLOWLIST.some((re) => re.test(command))) {
      return {
        allow: false,
        reason: `Bash command not in allowlist: "${command.slice(0, 80)}"`,
      };
    }
    return { allow: true };
  }

  return {
    allow: false,
    reason: `Tool "${toolName}" is not allowed for client editing`,
  };
}

function checkPath(filePath: string, worktreeRoot: string): GuardDecision {
  const abs = path.resolve(worktreeRoot, filePath);
  const rel = path.relative(worktreeRoot, abs);

  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return { allow: false, reason: `Path escapes worktree: ${filePath}` };
  }

  const matched = WRITE_ALLOWLIST.some((pattern) =>
    minimatch(rel, pattern, { dot: false }),
  );

  if (!matched) {
    return {
      allow: false,
      reason: `Path not in editable allowlist: ${rel}`,
    };
  }

  return { allow: true };
}
