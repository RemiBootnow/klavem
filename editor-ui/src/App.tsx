import { LoginGate } from "./components/LoginGate";
import { ChatPanel } from "./components/ChatPanel";
import { PreviewPanel } from "./components/PreviewPanel";

const PREVIEW_URL = import.meta.env.VITE_PREVIEW_URL ?? "http://localhost:3001";

export function App() {
  return (
    <LoginGate>
      <div className="grid h-dvh grid-cols-[380px_1fr] bg-background">
        <aside className="flex flex-col border-r">
          <header className="flex items-center gap-2 border-b px-4 py-3">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
              K
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold">Klavem Editor</span>
              <span className="text-xs text-muted-foreground">
                Décrivez vos modifications
              </span>
            </div>
          </header>
          <ChatPanel />
        </aside>
        <main className="min-w-0">
          <PreviewPanel previewUrl={PREVIEW_URL} />
        </main>
      </div>
    </LoginGate>
  );
}
