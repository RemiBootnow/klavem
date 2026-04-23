import { useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/api";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { Wrench, Ban, CheckCircle2 } from "lucide-react";

type ToolEvent = {
  id: string;
  name: string;
  input: unknown;
  result?: string;
  isError?: boolean;
  blocked?: boolean;
};

type Message =
  | { role: "user"; text: string; id: string }
  | {
      role: "assistant";
      text: string;
      tools: ToolEvent[];
      id: string;
      streaming?: boolean;
    };

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const prompt = input.trim();
    if (!prompt || sending) return;
    setInput("");
    setSending(true);

    const userMsg: Message = {
      role: "user",
      text: prompt,
      id: crypto.randomUUID(),
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      role: "assistant",
      text: "",
      tools: [],
      id: assistantId,
      streaming: true,
    };
    setMessages((m) => [...m, userMsg, assistantMsg]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      for await (const evt of streamChat({
        prompt,
        conversationId,
        signal: ac.signal,
      })) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantId || m.role !== "assistant") return m;
            if (evt.event === "text") {
              return { ...m, text: m.text + evt.data.text };
            }
            if (evt.event === "tool_use") {
              return {
                ...m,
                tools: [
                  ...m.tools,
                  {
                    id: evt.data.id,
                    name: evt.data.name,
                    input: evt.data.input,
                  },
                ],
              };
            }
            if (evt.event === "tool_result") {
              return {
                ...m,
                tools: m.tools.map((t) =>
                  t.id === evt.data.id
                    ? {
                        ...t,
                        result: evt.data.content,
                        isError: evt.data.is_error,
                        blocked:
                          evt.data.is_error &&
                          typeof evt.data.content === "string" &&
                          evt.data.content.includes("allowlist"),
                      }
                    : t,
                ),
              };
            }
            return m;
          }),
        );

        if (evt.event === "start") setConversationId(evt.data.conversationId);
        if (evt.event === "end" || evt.event === "done") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && m.role === "assistant"
                ? { ...m, streaming: false }
                : m,
            ),
          );
        }
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId && m.role === "assistant"
              ? {
                  ...m,
                  streaming: false,
                  text:
                    m.text +
                    `\n\n⚠️ Erreur: ${err instanceof Error ? err.message : String(err)}`,
                }
              : m,
          ),
        );
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            Dites à l'agent ce que vous voulez modifier. Par exemple :{" "}
            <em>"Ajoute la Peugeot 208 électrique 2023-2025."</em>
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Demandez une modification…"
            disabled={sending}
            className="min-h-[44px] max-h-48 resize-none"
          />
          <Button onClick={send} disabled={!input.trim() || sending}>
            {sending ? "…" : "Envoyer"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
          {message.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {message.tools.map((t) => (
        <ToolChip key={t.id} tool={t} />
      ))}
      {message.text && (
        <div className="max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {message.text}
          {message.streaming && <span className="animate-pulse">▍</span>}
        </div>
      )}
    </div>
  );
}

function ToolChip({ tool }: { tool: ToolEvent }) {
  const done = tool.result !== undefined;
  const icon = tool.blocked ? (
    <Ban className="size-3.5 text-destructive" />
  ) : tool.isError ? (
    <Ban className="size-3.5 text-destructive" />
  ) : done ? (
    <CheckCircle2 className="size-3.5 text-green-600" />
  ) : (
    <Wrench className="size-3.5 animate-pulse" />
  );
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground",
        tool.blocked && "border-destructive/40 text-destructive",
      )}
    >
      {icon}
      <span className="font-medium">{tool.name}</span>
      {toolSummary(tool)}
    </div>
  );
}

function toolSummary(tool: ToolEvent): string {
  const input = tool.input as Record<string, unknown> | undefined;
  if (tool.blocked) return "— bloqué (hors périmètre)";
  if (!input) return "";
  if (typeof input.file_path === "string") return `— ${input.file_path}`;
  if (typeof input.command === "string")
    return `— ${(input.command as string).slice(0, 40)}`;
  return "";
}
