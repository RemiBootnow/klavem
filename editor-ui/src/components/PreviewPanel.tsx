import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { fetchStatus, publish, resetDraft } from "@/lib/api";
import { RotateCw, Rocket, Undo2, ExternalLink } from "lucide-react";

interface PreviewPanelProps {
  previewUrl: string;
}

export function PreviewPanel({ previewUrl }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [dirty, setDirty] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const s = await fetchStatus();
        setDirty(s.draft.dirty);
      } catch {
        /* ignore */
      }
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  async function onPublish() {
    if (!confirm("Publier les changements en ligne ?")) return;
    setPublishing(true);
    try {
      const r = await publish();
      setToast(`Publié (${r.sha.slice(0, 7)}) — déploiement lancé.`);
      setDirty(false);
    } catch (e) {
      setToast(
        `Échec: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setPublishing(false);
      setTimeout(() => setToast(null), 5000);
    }
  }

  async function onReset() {
    if (!confirm("Annuler toutes les modifications non publiées ?")) return;
    await resetDraft();
    iframeRef.current?.contentWindow?.location.reload();
    setDirty(false);
    setToast("Brouillon réinitialisé.");
    setTimeout(() => setToast(null), 3000);
  }

  function reload() {
    iframeRef.current?.contentWindow?.location.reload();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`inline-block size-2 rounded-full ${dirty ? "bg-amber-500" : "bg-green-500"}`}
          />
          {dirty ? "Modifications non publiées" : "À jour"}
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={reload} title="Recharger">
          <RotateCw className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(previewUrl, "_blank")}
          title="Ouvrir dans un nouvel onglet"
        >
          <ExternalLink className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!dirty || publishing}
        >
          <Undo2 className="size-4" />
          Annuler
        </Button>
        <Button
          size="sm"
          onClick={onPublish}
          disabled={!dirty || publishing}
        >
          <Rocket className="size-4" />
          {publishing ? "Publication…" : "Publier"}
        </Button>
      </div>
      <div className="relative flex-1 bg-muted/20">
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className="size-full border-0"
          title="Preview"
        />
        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md border bg-card px-4 py-2 text-sm shadow-md">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
