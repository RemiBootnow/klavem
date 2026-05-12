"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  children: string;
  className?: string;
}

function ExpandableText({ children, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflow(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  return (
    <div className="flex flex-col gap-1">
      <p
        ref={ref}
        className={cn(!expanded && "line-clamp-2", className)}
      >
        {children}
      </p>
      {overflow && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="cursor-pointer self-start text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          {expanded ? "Afficher moins" : "Afficher plus"}
        </button>
      )}
    </div>
  );
}

export { ExpandableText };
