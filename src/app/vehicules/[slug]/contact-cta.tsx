"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/components/ui/button-variants";

interface ContactCtaProps {
  vehicleSlug: string;
  label?: string;
}

function ContactCta({ vehicleSlug, label = "Réserver mon véhicule" }: ContactCtaProps) {
  const inlineRef = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(true);
  const href = `/contact/?vehicle=${vehicleSlug}`;
  const btnClass = buttonVariants({
    variant: "default",
    size: "xl",
    className: "w-full",
  });

  useEffect(() => {
    const el = inlineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a ref={inlineRef} href={href} className={btnClass}>
        {label}
      </a>
      <div
        aria-hidden={inView}
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-200 lg:hidden",
          inView ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <a
          href={href}
          tabIndex={inView ? -1 : 0}
          className={cn(
            btnClass,
            "shadow-2xl shadow-foreground/25",
            inView ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
          {label}
        </a>
      </div>
    </>
  );
}

export { ContactCta };
