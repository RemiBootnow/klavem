"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";

interface Step {
  title: string;
  description: string;
}

interface StepListProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
}

function StepList({ steps, className, ...props }: StepListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const container = containerRef.current;
      const progress = progressRef.current;
      if (!container || !progress) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = rect.top + viewportHeight * 0.3;
      const end = rect.bottom - viewportHeight * 0.3;
      const current = viewportHeight * 0.5;

      const ratio = Math.max(0, Math.min(1, (current - start) / (end - start)));
      progress.style.height = `${ratio * 100}%`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      data-slot="step-list"
      className={cn("relative flex flex-col gap-12", className)}
      {...props}
    >
      <div className="absolute left-4.5 top-0 bottom-0 w-px bg-border on-dark:bg-white/25">
        <div
          ref={progressRef}
          className="w-full bg-linear-to-b from-primary to-[#58BAF2] on-dark:from-white on-dark:to-white/40"
          style={{ height: "0%" }}
        />
      </div>
      {steps.map((step, i) => (
        <div key={i} className="relative flex gap-6 pl-12">
          <span className="absolute left-0 flex size-[38px] items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground on-dark:bg-white on-dark:text-foreground">
            {i + 1}
          </span>
          <div className="flex flex-col gap-2">
            <Headline level={4}>{step.title}</Headline>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground on-dark:text-white/80">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export { StepList };
export type { StepListProps, Step };
