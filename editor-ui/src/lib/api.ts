import { getAuthHeader } from "./auth";

export type ServerEvent =
  | { event: "start"; data: { conversationId: string } }
  | { event: "text"; data: { kind: "text"; text: string } }
  | {
      event: "tool_use";
      data: { kind: "tool_use"; name: string; input: unknown; id: string };
    }
  | {
      event: "tool_result";
      data: {
        kind: "tool_result";
        id: string;
        content: string;
        is_error?: boolean;
      };
    }
  | {
      event: "done";
      data: { kind: "done"; cost_usd?: number; duration_ms?: number };
    }
  | { event: "error"; data: { message: string } }
  | { event: "end"; data: Record<string, never> };

const BASE = "/api";

function headers(extra: Record<string, string> = {}): HeadersInit {
  const auth = getAuthHeader();
  return {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
    ...extra,
  };
}

export async function fetchStatus() {
  const res = await fetch(`${BASE}/status`, { headers: headers() });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json() as Promise<{
    preview: { running: boolean; port: number };
    draft: { dirty: boolean; files: string[] };
    branches: { draft: string; main: string };
  }>;
}

export async function publish(message?: string) {
  const res = await fetch(`${BASE}/publish`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { reason?: string }).reason ?? `publish ${res.status}`);
  }
  return res.json() as Promise<{ ok: true; sha: string }>;
}

export async function resetDraft() {
  const res = await fetch(`${BASE}/reset`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error(`reset ${res.status}`);
  return res.json();
}

export async function fetchDiff(): Promise<string> {
  const res = await fetch(`${BASE}/diff`, { headers: headers() });
  if (!res.ok) throw new Error(`diff ${res.status}`);
  const body = (await res.json()) as { diff: string };
  return body.diff;
}

export async function* streamChat(args: {
  prompt: string;
  conversationId?: string;
  signal?: AbortSignal;
}): AsyncGenerator<ServerEvent, void> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: headers({ Accept: "text/event-stream" }),
    body: JSON.stringify({
      prompt: args.prompt,
      conversationId: args.conversationId,
    }),
    signal: args.signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`chat ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const raw = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const parsed = parseSseBlock(raw);
      if (parsed) yield parsed as ServerEvent;
    }
  }
}

function parseSseBlock(block: string): { event: string; data: unknown } | null {
  let event = "message";
  const dataLines: string[] = [];
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trimStart());
  }
  if (dataLines.length === 0) return null;
  try {
    return { event, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return { event, data: dataLines.join("\n") };
  }
}
