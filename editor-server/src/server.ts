import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { streamSSE } from "hono/streaming";
import { basicAuth } from "hono/basic-auth";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env.js";
import { Git } from "./git.js";
import { PreviewSupervisor } from "./preview.js";
import { runAgent } from "./agent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const worktreePath = path.resolve(repoRoot, env.WORKTREE_PATH);

const git = new Git(repoRoot, worktreePath, env.DRAFT_BRANCH, env.MAIN_BRANCH);
const preview = new PreviewSupervisor(worktreePath, env.PREVIEW_PORT, env.PREVIEW_HOST);

const sessions = new Map<string, string>();

const app = new Hono();

app.use("*", basicAuth({ username: "client", password: env.EDITOR_PASSWORD }));

app.get("/status", async (c) => {
  if (env.DEMO_MODE) {
    return c.json({
      preview: { running: false, port: env.PREVIEW_PORT },
      draft: { dirty: false, files: [] },
      branches: { draft: env.DRAFT_BRANCH, main: env.MAIN_BRANCH },
      demo: true,
    });
  }
  const status = await git.status();
  return c.json({
    preview: { running: preview.isRunning(), port: env.PREVIEW_PORT },
    draft: status,
    branches: { draft: env.DRAFT_BRANCH, main: env.MAIN_BRANCH },
  });
});

app.post("/chat", async (c) => {
  if (!env.ANTHROPIC_API_KEY) {
    return c.json(
      {
        error:
          "ANTHROPIC_API_KEY n'est pas configuré dans editor-server/.env — le chat est désactivé.",
      },
      503,
    );
  }

  const body = await c.req.json<{ prompt: string; conversationId?: string }>();
  const conversationId = body.conversationId ?? crypto.randomUUID();
  const resumeSessionId = sessions.get(conversationId);

  return streamSSE(c, async (stream) => {
    const ac = new AbortController();
    stream.onAbort(() => ac.abort());

    await stream.writeSSE({
      event: "start",
      data: JSON.stringify({ conversationId }),
    });

    const iter = runAgent({
      prompt: body.prompt,
      worktreePath,
      resumeSessionId,
      signal: ac.signal,
    });

    try {
      while (true) {
        const next = await iter.next();
        if (next.done) {
          if (next.value.sessionId) {
            sessions.set(conversationId, next.value.sessionId);
          }
          break;
        }
        await stream.writeSSE({
          event: next.value.kind,
          data: JSON.stringify(next.value),
        });
      }
    } catch (err) {
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({
          message: err instanceof Error ? err.message : String(err),
        }),
      });
    }

    await stream.writeSSE({ event: "end", data: "{}" });
  });
});

app.post("/publish", async (c) => {
  const body = await c.req
    .json<{ message?: string }>()
    .catch(() => ({ message: undefined }) as { message?: string });
  const commitMessage = body.message ?? "client: publish draft";

  const commit = await git.commitAll(commitMessage);
  if (!commit.committed && (await git.status()).dirty === false) {
    return c.json({ ok: false, reason: "nothing to publish" }, 400);
  }
  const { sha } = await git.publish();
  return c.json({ ok: true, sha });
});

app.post("/reset", async (c) => {
  await git.resetDraftToMain();
  return c.json({ ok: true });
});

app.get("/diff", async (c) => {
  const diff = await git.diffSummary();
  return c.json({ diff });
});

async function main() {
  if (env.DEMO_MODE) {
    console.log("[demo] DEMO_MODE=true — skipping worktree + preview supervisor");
  } else {
    await git.ensureWorktree();
    preview.start();
  }

  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    console.log(`editor-server listening on http://localhost:${info.port}`);
    if (!env.DEMO_MODE) {
      console.log(`preview on http://${env.PREVIEW_HOST}:${env.PREVIEW_PORT}`);
    }
  });

  const shutdown = async () => {
    console.log("shutting down...");
    await preview.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
