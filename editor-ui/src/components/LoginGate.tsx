import { useEffect, useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { clearPassword, getAuthHeader, setPassword } from "@/lib/auth";
import { fetchStatus } from "@/lib/api";

type State = "checking" | "needs-auth" | "authed";

export function LoginGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>("checking");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getAuthHeader()) {
      setState("needs-auth");
      return;
    }
    fetchStatus()
      .then(() => setState("authed"))
      .catch(() => {
        clearPassword();
        setState("needs-auth");
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    setPassword(pw);
    try {
      await fetchStatus();
      setState("authed");
    } catch {
      clearPassword();
      setErr("Mot de passe invalide");
    } finally {
      setSubmitting(false);
    }
  }

  if (state === "checking") {
    return (
      <div className="flex h-dvh items-center justify-center text-muted-foreground text-sm">
        …
      </div>
    );
  }

  if (state === "needs-auth") {
    return (
      <div className="flex h-dvh items-center justify-center bg-muted/30">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm"
        >
          <h1 className="mb-1 text-lg font-semibold">Klavem Editor</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Entrez votre mot de passe pour accéder à l'éditeur.
          </p>
          <Input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Mot de passe"
            className="mb-3"
          />
          {err && <p className="mb-3 text-sm text-destructive">{err}</p>}
          <Button type="submit" disabled={submitting || !pw} className="w-full">
            {submitting ? "Vérification…" : "Se connecter"}
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
