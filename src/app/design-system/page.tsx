import type { Metadata } from "next";
import { Button } from "@/components/components/ui/button";
import { Headliner } from "@/components/components/headliner";
import { Headline } from "@/components/components/headline";
import { ContentBlock } from "@/components/blocks/content-block";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <h2 className="border-b pb-2 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 shrink-0 rounded-md ${className}`} />
      <span className="text-sm font-mono">{name}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16 space-y-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
        <p className="mt-2 text-muted-foreground">
          Component inventory for Klavem.
        </p>
      </div>

      {/* ——— Colors ——— */}
      <Section title="Colors">
        <Subsection title="Base">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="background" className="bg-background border" />
            <ColorSwatch name="foreground" className="bg-foreground" />
          </div>
        </Subsection>

        <Subsection title="Primary">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="primary" className="bg-primary" />
            <ColorSwatch
              name="primary-foreground"
              className="bg-primary-foreground border"
            />
          </div>
        </Subsection>

        <Subsection title="Secondary">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="secondary" className="bg-secondary" />
            <ColorSwatch
              name="secondary-foreground"
              className="bg-secondary-foreground"
            />
          </div>
        </Subsection>

        <Subsection title="Muted">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="muted" className="bg-muted" />
            <ColorSwatch
              name="muted-foreground"
              className="bg-muted-foreground"
            />
          </div>
        </Subsection>

        <Subsection title="Accent">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="accent" className="bg-accent" />
            <ColorSwatch
              name="accent-foreground"
              className="bg-accent-foreground"
            />
          </div>
        </Subsection>

        <Subsection title="Destructive">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="destructive" className="bg-destructive" />
          </div>
        </Subsection>

        <Subsection title="Border / Input / Ring">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="border" className="bg-border" />
            <ColorSwatch name="input" className="bg-input" />
            <ColorSwatch name="ring" className="bg-ring" />
          </div>
        </Subsection>

        <Subsection title="Surfaces">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ColorSwatch name="card" className="bg-card border" />
            <ColorSwatch name="card-foreground" className="bg-card-foreground" />
            <ColorSwatch name="popover" className="bg-popover border" />
            <ColorSwatch
              name="popover-foreground"
              className="bg-popover-foreground"
            />
          </div>
        </Subsection>

        <Subsection title="Charts">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <ColorSwatch name="chart-1" className="bg-chart-1" />
            <ColorSwatch name="chart-2" className="bg-chart-2" />
            <ColorSwatch name="chart-3" className="bg-chart-3" />
            <ColorSwatch name="chart-4" className="bg-chart-4" />
            <ColorSwatch name="chart-5" className="bg-chart-5" />
          </div>
        </Subsection>
      </Section>

      {/* ——— Components ——— */}
      <Section title="Components">
        <Subsection title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Subsection>

        <Subsection title="Headliner">
          <Headliner>This is a headliner</Headliner>
        </Subsection>

        <Subsection title="Headline">
          <div className="space-y-2">
            <Headline level={1}>Headline level 1</Headline>
            <Headline level={2}>Headline level 2</Headline>
            <Headline level={3}>Headline level 3</Headline>
            <Headline level={4}>Headline level 4</Headline>
          </div>
        </Subsection>
      </Section>

      {/* ——— Blocks ——— */}
      <Section title="Blocks">
        <Subsection title="ContentBlock — Left aligned (default)">
          <ContentBlock
            headliner="Introducing"
            headline="Build faster with Klavem"
            paragraph="A modern component system designed for speed, clarity, and flexibility. Ship beautiful interfaces without the overhead."
            actions={[
              { label: "Get started" },
              { label: "Learn more", variant: "outline" },
            ]}
          />
        </Subsection>

        <Subsection title="ContentBlock — Centered">
          <ContentBlock
            centered
            headliner="Why Klavem"
            headline="Trusted by teams everywhere"
            paragraph="Join thousands of developers building modern web experiences with a system that scales."
            actions={[{ label: "Start free trial" }]}
          />
        </Subsection>

        <Subsection title="ContentBlock — Minimal (no headliner, no actions)">
          <ContentBlock
            headline="Simple and clean"
            headlineLevel={3}
            paragraph="Not every block needs all the bells and whistles."
          />
        </Subsection>
      </Section>

      {/* ——— Sections ——— */}
      <Section title="Sections">
        <p className="text-sm text-muted-foreground">
          No sections created yet.
        </p>
      </Section>
    </main>
  );
}
