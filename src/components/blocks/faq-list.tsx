"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FaqItem[];
}

function FaqList({ items, className, ...props }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      data-slot="faq-list"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-[20px] bg-muted px-6 py-2">
            <button
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-lg font-medium"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span
                className={cn(
                  "shrink-0 text-xl leading-none text-primary transition-transform duration-300",
                  isOpen && "rotate-45"
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <p className="overflow-hidden text-sm leading-relaxed text-foreground">
                <span className="block pb-5">{item.answer}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { FaqList };
export type { FaqListProps, FaqItem };
