import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import { checkToolCall } from "./guard.js";

export type ChatEvent =
  | { kind: "text"; text: string }
  | { kind: "tool_use"; name: string; input: unknown; id: string }
  | { kind: "tool_result"; id: string; content: string; is_error?: boolean }
  | { kind: "blocked"; tool: string; reason: string }
  | { kind: "done"; cost_usd?: number; duration_ms?: number }
  | { kind: "error"; message: string };

export interface RunArgs {
  prompt: string;
  worktreePath: string;
  resumeSessionId?: string;
  signal?: AbortSignal;
}

export interface RunResult {
  sessionId?: string;
}

export async function* runAgent(args: RunArgs): AsyncGenerator<ChatEvent, RunResult> {
  const { prompt, worktreePath, resumeSessionId, signal } = args;

  const options: Options = {
    cwd: worktreePath,
    settingSources: ["user", "project"],
    permissionMode: "default",
    resume: resumeSessionId,
    hooks: {
      PreToolUse: [
        {
          matcher: "Write|Edit|MultiEdit|NotebookEdit|Bash",
          hooks: [
            async (input) => {
              const toolName = (input as { tool_name: string }).tool_name;
              const toolInput = (input as { tool_input: Record<string, unknown> })
                .tool_input;
              const decision = checkToolCall({
                toolName,
                toolInput,
                worktreeRoot: worktreePath,
              });
              if (decision.allow) return {};
              return {
                hookSpecificOutput: {
                  hookEventName: "PreToolUse" as const,
                  permissionDecision: "deny" as const,
                  permissionDecisionReason: decision.reason,
                },
              };
            },
          ],
        },
      ],
    },
  };

  let sessionId: string | undefined;

  try {
    for await (const message of query({ prompt, options })) {
      if (signal?.aborted) break;

      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }

      if (message.type === "assistant") {
        for (const block of message.message.content) {
          if (block.type === "text") {
            yield { kind: "text", text: block.text };
          } else if (block.type === "tool_use") {
            yield {
              kind: "tool_use",
              name: block.name,
              input: block.input,
              id: block.id,
            };
          }
        }
      }

      if (message.type === "user") {
        for (const block of message.message.content) {
          if (typeof block === "object" && block.type === "tool_result") {
            const content =
              typeof block.content === "string"
                ? block.content
                : JSON.stringify(block.content);
            yield {
              kind: "tool_result",
              id: block.tool_use_id,
              content,
              is_error: block.is_error,
            };
          }
        }
      }

      if (message.type === "result") {
        yield {
          kind: "done",
          cost_usd: message.total_cost_usd,
          duration_ms: message.duration_ms,
        };
      }
    }
  } catch (err) {
    yield {
      kind: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }

  return { sessionId };
}
