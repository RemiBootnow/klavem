"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, X, MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/components/logo";
import { Button } from "@/components/components/ui/button";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { BODY_CATEGORIES, MOTORISATIONS } from "@/lib/vehicles";

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
          ? "border-b bg-background/95 backdrop-blur-md"
          : "bg-transparent text-white"
      )}
    >
      <div className="w-full px-8">
        <div className="flex items-center gap-4 py-4">
          <div className="flex flex-1 items-center">
            <a href="/" className="shrink-0">
              <Logo variant={solid ? "default" : "white"} />
            </a>
          </div>

          <Suspense fallback={null}>
            <HeaderSearch solid={solid} className="hidden md:flex" />
          </Suspense>

          <div className="flex flex-1 items-center justify-end">
            <a
              href="/contact/"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "hidden shrink-0 md:inline-flex"
              )}
            >
              Nous contacter
            </a>
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
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <div className="w-full px-8">
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
          </div>
        </div>
      )}
    </header>
  );
}

type FilterKey = "type" | "tarifs" | "motorisation";

const DEFAULT_PRICE_MIN = 200;
const DEFAULT_PRICE_MAX = 1000;

function HeaderSearch({
  solid,
  className,
}: {
  solid: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [moto, setMoto] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState<number>(DEFAULT_PRICE_MIN);
  const [priceMax, setPriceMax] = useState<number>(DEFAULT_PRICE_MAX);
  const [priceDirty, setPriceDirty] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setType(searchParams.get("type"));
    setMoto(searchParams.get("moto"));
    const rawMin = Number(searchParams.get("min"));
    const rawMax = Number(searchParams.get("max"));
    const hasMin = Number.isFinite(rawMin) && rawMin > 0;
    const hasMax = Number.isFinite(rawMax) && rawMax > 0;
    setPriceMin(hasMin ? rawMin : DEFAULT_PRICE_MIN);
    setPriceMax(hasMax ? rawMax : DEFAULT_PRICE_MAX);
    setPriceDirty(
      (hasMin && rawMin !== DEFAULT_PRICE_MIN) ||
        (hasMax && rawMax !== DEFAULT_PRICE_MAX)
    );
  }, [searchParams]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (pathname !== "/vehicules") return;
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (moto) params.set("moto", moto);
    if (priceDirty) {
      params.set("min", String(priceMin));
      params.set("max", String(priceMax));
    }
    const next = params.toString();
    if (next === searchParams.toString()) return;
    router.replace(next ? `/vehicules?${next}` : "/vehicules", {
      scroll: false,
    });
  }, [
    type,
    moto,
    priceMin,
    priceMax,
    priceDirty,
    pathname,
    router,
    searchParams,
  ]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (moto) params.set("moto", moto);
    params.set("min", String(priceMin));
    params.set("max", String(priceMax));
    router.push(`/vehicules?${params.toString()}`);
  }

  const soft = !solid && openKey === null;

  return (
    <div
      ref={ref}
      className={cn(
        "group/search relative items-center gap-1 rounded-full border p-1 transition-all duration-300",
        soft
          ? "border-transparent bg-white/10 text-white shadow-none hover:border-border hover:bg-background hover:text-foreground hover:shadow-sm"
          : "border-border bg-background text-foreground shadow-sm",
        className
      )}
    >
      <FilterButton
        label="Type de véhicule"
        value={type}
        active={openKey === "type"}
        soft={soft}
        onClick={() => setOpenKey((k) => (k === "type" ? null : "type"))}
      />
      <Divider soft={soft} />
      <FilterButton
        label="Tarifs"
        value={priceDirty ? `${priceMin}–${priceMax}€/sem` : null}
        active={openKey === "tarifs"}
        soft={soft}
        onClick={() =>
          setOpenKey((k) => (k === "tarifs" ? null : "tarifs"))
        }
      />
      <Divider soft={soft} />
      <FilterButton
        label="Motorisation"
        value={moto}
        active={openKey === "motorisation"}
        soft={soft}
        onClick={() =>
          setOpenKey((k) => (k === "motorisation" ? null : "motorisation"))
        }
      />
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Rechercher"
        className={cn(
          "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300",
          soft
            ? "bg-white text-foreground group-hover/search:bg-primary group-hover/search:text-primary-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/80"
        )}
      >
        <MagnifyingGlass size={18} weight="bold" />
      </button>

      {openKey === "type" && (
        <DropdownPanel>
          <OptionList
            options={BODY_CATEGORIES}
            selected={type}
            onSelect={(v) => {
              setType(v);
              setOpenKey(null);
            }}
          />
        </DropdownPanel>
      )}
      {openKey === "tarifs" && (
        <DropdownPanel>
          <PriceRange
            min={priceMin}
            max={priceMax}
            onChange={(a, b) => {
              setPriceMin(a);
              setPriceMax(b);
              setPriceDirty(a !== DEFAULT_PRICE_MIN || b !== DEFAULT_PRICE_MAX);
            }}
          />
        </DropdownPanel>
      )}
      {openKey === "motorisation" && (
        <DropdownPanel>
          <OptionList
            options={[...MOTORISATIONS]}
            selected={moto}
            onSelect={(v) => {
              setMoto(v);
              setOpenKey(null);
            }}
          />
        </DropdownPanel>
      )}
    </div>
  );
}

function Divider({ soft }: { soft: boolean }) {
  return (
    <div
      className={cn(
        "h-4 w-px shrink-0 transition-colors duration-300",
        soft ? "bg-white/30 group-hover/search:bg-border" : "bg-border"
      )}
    />
  );
}

interface FilterButtonProps {
  label: string;
  value: string | null;
  active: boolean;
  soft: boolean;
  onClick: () => void;
}

function FilterButton({
  label,
  value,
  active,
  soft,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
        active && "bg-muted",
        soft
          ? cn(
              "group-hover/search:hover:bg-muted",
              value
                ? "text-white group-hover/search:text-foreground"
                : "text-white/80 group-hover/search:text-muted-foreground"
            )
          : cn(
              "hover:bg-muted",
              value ? "text-foreground" : "text-muted-foreground"
            )
      )}
    >
      <span>{value ?? label}</span>
    </button>
  );
}

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-20 mx-auto min-w-[260px] max-w-[320px] rounded-2xl border border-border bg-background p-3 text-foreground shadow-lg">
      {children}
    </div>
  );
}

interface OptionListProps {
  options: readonly string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
}

function OptionList({ options, selected, onSelect }: OptionListProps) {
  return (
    <ul className="flex flex-col gap-1">
      <li>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
            selected === null && "bg-muted font-medium"
          )}
        >
          Tous
        </button>
      </li>
      {options.map((o) => (
        <li key={o}>
          <button
            type="button"
            onClick={() => onSelect(o)}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
              selected === o && "bg-muted font-medium"
            )}
          >
            {o}
          </button>
        </li>
      ))}
    </ul>
  );
}

interface PriceRangeProps {
  min: number;
  max: number;
  onChange: (a: number, b: number) => void;
}

const PRICE_ABS_MIN = 0;
const PRICE_ABS_MAX = 2000;
const PRICE_STEP = 10;

const thumbClasses = cn(
  "pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent",
  "[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-grab active:[&::-moz-range-thumb]:cursor-grabbing"
);

function PriceRange({ min, max, onChange }: PriceRangeProps) {
  const minPct =
    ((min - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;
  const maxPct =
    ((max - PRICE_ABS_MIN) / (PRICE_ABS_MAX - PRICE_ABS_MIN)) * 100;

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{min}€/sem</span>
        <span>{max}€/sem</span>
      </div>
      <div className="relative h-4">
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          aria-label="Prix minimum"
          min={PRICE_ABS_MIN}
          max={PRICE_ABS_MAX}
          step={PRICE_STEP}
          value={min}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), max - PRICE_STEP);
            onChange(v, max);
          }}
          className={thumbClasses}
        />
        <input
          type="range"
          aria-label="Prix maximum"
          min={PRICE_ABS_MIN}
          max={PRICE_ABS_MAX}
          step={PRICE_STEP}
          value={max}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), min + PRICE_STEP);
            onChange(min, v);
          }}
          className={thumbClasses}
        />
      </div>
    </div>
  );
}

export { Header };
export type { HeaderProps, HeaderVariant };
