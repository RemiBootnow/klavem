"use client";

import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/components/container";
import { Logo } from "@/components/components/logo";
import { Button } from "@/components/components/ui/button";
import { buttonVariants } from "@/components/components/ui/button-variants";

const navLinks = [
  { label: "Véhicules", href: "/vehicules/" },
  { label: "Offres", href: "/offres/" },
  { label: "Tarifs", href: "/tarifs/" },
  { label: "Zones", href: "/location-vtc-ile-de-france/" },
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/faq/" },
];

type HeaderVariant = "transparent" | "light";

interface HeaderProps {
  variant?: HeaderVariant;
}

function Header({ variant = "transparent" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLight = variant === "light";

  useEffect(() => {
    if (isLight) return;
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLight]);

  const solid = isLight || scrolled;

  return (
    <header
      data-slot="header"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        solid
          ? "border-b bg-background/80 backdrop-blur-md"
          : "bg-transparent text-white"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="/">
            <Logo variant={solid ? "default" : "white"} />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  solid
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex">
            <a href="/contact/" className={buttonVariants({ variant: "neutral", size: "sm" })}>
              Je réserve
            </a>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </Button>
        </div>
      </Container>

      {open && (
        <div className="border-t md:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/contact/"
                className={cn(buttonVariants(), "mt-2")}
                onClick={() => setOpen(false)}
              >
                Je réserve
              </a>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

export { Header };
export type { HeaderProps, HeaderVariant };
