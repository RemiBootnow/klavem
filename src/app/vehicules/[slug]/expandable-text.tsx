"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/components/ui/button-variants";

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
        className={cn(!expanded && "line-clamp-3", className)}
      >
        {children}
      </p>
      {overflow && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={buttonVariants({
            variant: "secondary",
            size: "sm",
            className: "cursor-pointer self-start",
          })}
        >
          {expanded ? "Afficher moins" : "Afficher plus"}
        </button>
      )}
    </div>
  );
}

export { ExpandableText };
