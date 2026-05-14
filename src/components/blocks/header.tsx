"use client";

import Link from "next/link";
import { Suspense, useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List, X, MagnifyingGlass, Phone } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Logo, LogoIcon } from "@/components/components/logo";
import { Button } from "@/components/components/ui/button";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { BODY_CATEGORIES, MOTORISATIONS } from "@/lib/vehicles";

const navLinks = [
  { label: "Véhicules", href: "/vehicules/" },
  { label: "Blog", href: "/blog/" },
];

type HeaderVariant = "transparent" | "light";

interface HeaderProps {
  variant?: HeaderVariant;
}

function Header({ variant = "transparent" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const isLight = variant === "light";

  useEffect(() => {
    if (isLight) return;
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLight]);

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      if (!headerRef.current) return;
      if (!headerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const solid = isLight || scrolled || open;

  return (
    <>
    <div
      aria-hidden="true"
      onClick={() => setOpen(false)}
      className={cn(
        "fixed inset-0 z-40 bg-foreground/5 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    />
    <header
      ref={headerRef}
      data-slot="header"
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        !open && "transition-colors duration-300",
        solid
          ? "border-b border-foreground/5 bg-background backdrop-blur-md"
          : "bg-transparent text-white"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-6 max-[393px]:px-4">
        <div className="flex items-center gap-3 py-3 lg:items-start lg:gap-4 lg:py-4">
          <div className="flex h-12 flex-1 items-center lg:h-13">
            <Link href="/" className="shrink-0">
              <LogoIcon
                variant={solid ? "default" : "white"}
                className="lg:hidden"
              />
              <Logo
                variant={solid ? "default" : "white"}
                className="hidden lg:block"
              />
            </Link>
          </div>

          <Suspense fallback={null}>
            <HeaderSearch solid={solid} className="hidden lg:block" />
          </Suspense>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border py-3 pl-3 pr-4 text-sm font-medium transition-colors lg:hidden",
              solid
                ? "border-transparent bg-muted text-foreground"
                : "border-white/10 bg-white/10 text-white"
            )}
          >
            <MagnifyingGlass size={20} className="shrink-0" />
            <span>Rechercher un véhicule</span>
          </button>

          <div className="flex h-12 flex-1 items-center justify-end gap-2 lg:h-13">
            <a
              href="tel:+33189623122"
              aria-label="Appeler le 01 89 62 31 22"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "group/call hidden w-42 shrink-0 overflow-hidden lg:inline-flex"
              )}
            >
              <Phone size={16} weight="bold" />
              <span className="relative inline-grid w-29 overflow-hidden text-center">
                <span className="transition-transform duration-200 group-hover/call:-translate-y-full">
                  Nous contacter
                </span>
                <span className="absolute inset-0 translate-y-full transition-transform duration-200 group-hover/call:translate-y-0">
                  01 89 62 31 22
                </span>
              </span>
            </a>
            <div className="hidden lg:relative lg:inline-flex">
              <Button
                variant="secondary"
                size="icon-lg"
                className="cursor-pointer"
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                aria-expanded={open}
              >
                {open ? <X size={20} /> : <List size={20} />}
              </Button>
              {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border bg-background text-foreground shadow-lg">
                  <div className="w-full px-3">
                    <HeaderNavLinks onLinkClick={() => setOpen(false)} />
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-lg"
              className={cn(
                "size-11 lg:hidden",
                !solid && "text-white hover:bg-white/10 hover:text-white"
              )}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="size-6" /> : <List className="size-6" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div className="border-t bg-background text-foreground">
            <div className="w-full px-8">
              <HeaderNavLinks onLinkClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </div>

    </header>
    {searchOpen && (
      <MobileSearchDialog solid={solid} onClose={() => setSearchOpen(false)} />
    )}
    </>
  );
}

type FilterKey = "type" | "tarifs" | "motorisation";

const DEFAULT_PRICE_MIN = 200;
const DEFAULT_PRICE_MAX = 1000;
const PRICE_OPTIONS = [
  { label: "Moins de 300€/sem", min: 0, max: 299 },
  { label: "300–320€/sem", min: 300, max: 320 },
  { label: "320€ et plus", min: 321, max: 2000 },
] as const;

function HeaderSearch({
  solid,
  className,
  layout,
  onSearchComplete,
}: {
  solid: boolean;
  className?: string;
  layout?: "desktop" | "mobile";
  onSearchComplete?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialState = useMemo(
    () => getHeaderSearchState(searchParams),
    [searchParams]
  );

  return (
    <HeaderSearchContent
      key={`${pathname}?${searchParams.toString()}`}
      solid={solid}
      className={className}
      initialState={initialState}
      layout={layout}
      onSearchComplete={onSearchComplete}
    />
  );
}

type HeaderSearchState = {
  type: string | null;
  moto: string | null;
  priceMin: number;
  priceMax: number;
  priceDirty: boolean;
};

function getHeaderSearchState(searchParams: {
  get: (name: string) => string | null;
}): HeaderSearchState {
  const rawMin = Number(searchParams.get("min"));
  const rawMax = Number(searchParams.get("max"));
  const hasMin = Number.isFinite(rawMin) && rawMin > 0;
  const hasMax = Number.isFinite(rawMax) && rawMax > 0;

  return {
    type: searchParams.get("type"),
    moto: searchParams.get("motorisation") ?? searchParams.get("moto"),
    priceMin: hasMin ? rawMin : DEFAULT_PRICE_MIN,
    priceMax: hasMax ? rawMax : DEFAULT_PRICE_MAX,
    priceDirty:
      (hasMin && rawMin !== DEFAULT_PRICE_MIN) ||
      (hasMax && rawMax !== DEFAULT_PRICE_MAX),
  };
}

function HeaderSearchContent({
  solid,
  className,
  initialState,
  layout = "desktop",
  onSearchComplete,
}: {
  solid: boolean;
  className?: string;
  initialState: HeaderSearchState;
  layout?: "desktop" | "mobile";
  onSearchComplete?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openKey, setOpenKey] = useState<FilterKey | null>(null);
  const [type, setType] = useState<string | null>(initialState.type);
  const [moto, setMoto] = useState<string | null>(initialState.moto);
  const [priceMin, setPriceMin] = useState<number>(initialState.priceMin);
  const [priceMax, setPriceMax] = useState<number>(initialState.priceMax);
  const [priceDirty, setPriceDirty] = useState(initialState.priceDirty);
  const ref = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<Partial<Record<FilterKey, HTMLButtonElement>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!openKey) return;
    const btn = filterRefs.current[openKey];
    if (!btn) return;
    const parent = btn.parentElement;
    if (!parent) return;

    const update = () => {
      if (openKey === "type") {
        setIndicator({ left: 0, width: btn.offsetLeft + btn.offsetWidth });
        return;
      }
      if (openKey === "motorisation") {
        setIndicator({
          left: btn.offsetLeft,
          width: parent.clientWidth - btn.offsetLeft,
        });
        return;
      }
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [openKey, type, moto, priceDirty, priceMin, priceMax]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpenKey(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (moto) params.set("motorisation", moto);
    if (priceDirty) {
      params.set("min", String(priceMin));
      params.set("max", String(priceMax));
    }
    router.push(`/vehicules?${params.toString()}`);
    onSearchComplete?.();
  }

  const soft = !solid && openKey === null;
  const isOpen = openKey !== null;
  const isMobile = layout === "mobile";

  if (isMobile) {
    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)}>
        <MobileFilterCard
          label="Type de véhicule"
          placeholder="Tous les types"
          value={type}
          isOpen={openKey === "type"}
          onToggle={() => setOpenKey((k) => (k === "type" ? null : "type"))}
        >
          <MobileOptionList
            allLabel="Tous"
            options={[...BODY_CATEGORIES]}
            selected={type}
            onSelect={(v) => {
              setType(v);
              setOpenKey(null);
            }}
          />
        </MobileFilterCard>
        <MobileFilterCard
          label="Tarifs"
          placeholder="Ajouter un type"
          value={priceDirty ? getPriceLabel(priceMin, priceMax) : null}
          isOpen={openKey === "tarifs"}
          onToggle={() =>
            setOpenKey((k) => (k === "tarifs" ? null : "tarifs"))
          }
        >
          <MobilePriceOptions
            min={priceMin}
            max={priceMax}
            dirty={priceDirty}
            onSelect={(a, b) => {
              setPriceMin(a);
              setPriceMax(b);
              setPriceDirty(
                a !== DEFAULT_PRICE_MIN || b !== DEFAULT_PRICE_MAX
              );
              setOpenKey(null);
            }}
            onClear={() => {
              setPriceMin(DEFAULT_PRICE_MIN);
              setPriceMax(DEFAULT_PRICE_MAX);
              setPriceDirty(false);
              setOpenKey(null);
            }}
          />
        </MobileFilterCard>
        <MobileFilterCard
          label="Motorisation"
          placeholder="Ajouter une motorisation"
          value={moto}
          isOpen={openKey === "motorisation"}
          onToggle={() =>
            setOpenKey((k) => (k === "motorisation" ? null : "motorisation"))
          }
        >
          <MobileOptionList
            allLabel="Tous"
            options={[...MOTORISATIONS]}
            selected={moto}
            onSelect={(v) => {
              setMoto(v);
              setOpenKey(null);
            }}
          />
        </MobileFilterCard>

        <button
          type="button"
          onClick={handleSearch}
          aria-label="Rechercher"
          className="fixed left-1/2 z-20 flex h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.1),inset_0px_4px_4px_0px_rgba(255,255,255,0.1),0px_8px_24px_rgba(0,54,255,0.25)] transition-colors hover:bg-primary/90"
          style={{
            bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
        >
          <MagnifyingGlass className="size-5" />
          <span>Rechercher</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        className={cn(
          "group/search rounded-[24px] border border-transparent shadow-none transition-[background-color,color] duration-300",
          isOpen
            ? "bg-muted text-foreground"
            : soft
              ? "bg-white/15 text-white hover:bg-muted hover:text-foreground"
              : "bg-muted text-foreground"
        )}
      >
        <div className="relative flex items-center gap-1 p-1">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 rounded-full bg-background shadow-md transition-all duration-300",
              openKey ? "opacity-100" : "opacity-0"
            )}
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
            }}
          />
          <FilterButton
            buttonRef={(el) => {
              filterRefs.current.type = el ?? undefined;
            }}
            label="Type de véhicule"
            value={type}
            active={openKey === "type"}
            soft={soft}
            onClick={() => setOpenKey((k) => (k === "type" ? null : "type"))}
          />
          <Divider
            soft={soft}
            hidden={openKey === "type" || openKey === "tarifs"}
          />
          <FilterButton
            buttonRef={(el) => {
              filterRefs.current.tarifs = el ?? undefined;
            }}
            label="Tarifs"
            value={priceDirty ? getPriceLabel(priceMin, priceMax) : null}
            active={openKey === "tarifs"}
            soft={soft}
            onClick={() =>
              setOpenKey((k) => (k === "tarifs" ? null : "tarifs"))
            }
          />
          <Divider
            soft={soft}
            hidden={openKey === "tarifs" || openKey === "motorisation"}
          />
          <FilterButton
            buttonRef={(el) => {
              filterRefs.current.motorisation = el ?? undefined;
            }}
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
              "relative z-10 flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-full px-2 transition-all duration-300",
              isOpen && "gap-2 px-3",
              soft
                ? "bg-white text-foreground group-hover/search:bg-primary group-hover/search:text-primary-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/80"
            )}
          >
            <MagnifyingGlass size={18} weight="bold" className="shrink-0" />
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300",
                isOpen ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
              )}
            >
              Rechercher
            </span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-lg transition-all duration-300",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className="px-3 py-3">
          {openKey === "type" && (
            <OptionList
              options={BODY_CATEGORIES}
              selected={type}
              onSelect={(v) => {
                setType(v);
                setOpenKey(null);
              }}
            />
          )}
          {openKey === "tarifs" && (
            <PriceOptions
              min={priceMin}
              max={priceMax}
              dirty={priceDirty}
              onSelect={(a, b) => {
                setPriceMin(a);
                setPriceMax(b);
                setPriceDirty(
                  a !== DEFAULT_PRICE_MIN || b !== DEFAULT_PRICE_MAX
                );
                setOpenKey(null);
              }}
              onClear={() => {
                setPriceMin(DEFAULT_PRICE_MIN);
                setPriceMax(DEFAULT_PRICE_MAX);
                setPriceDirty(false);
                setOpenKey(null);
              }}
            />
          )}
          {openKey === "motorisation" && (
            <OptionList
              options={[...MOTORISATIONS]}
              selected={moto}
              onSelect={(v) => {
                setMoto(v);
                setOpenKey(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Divider({ soft, hidden }: { soft: boolean; hidden?: boolean }) {
  return (
    <div
      className={cn(
        "h-4 w-px shrink-0 transition-[background-color,opacity] duration-300",
        hidden && "opacity-0",
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
  mobile?: boolean;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

function FilterButton({
  label,
  value,
  active,
  soft,
  mobile = false,
  onClick,
  buttonRef,
}: FilterButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        "relative z-10 flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
        active
          ? "cursor-default text-foreground"
          : cn(
              "cursor-pointer",
              mobile && "min-h-11 justify-between rounded-xl bg-muted",
              mobile
                ? value
                  ? "text-foreground"
                  : "text-muted-foreground"
                : soft
                  ? cn(
                      "group-hover/search:hover:bg-black/5",
                      value
                        ? "text-white group-hover/search:text-foreground"
                        : "text-white/80 group-hover/search:text-muted-foreground"
                    )
                  : cn(
                      "hover:bg-black/5",
                      value ? "text-foreground" : "text-muted-foreground"
                    )
            )
      )}
    >
      <span>{value ?? label}</span>
    </button>
  );
}

function MobileSearchDialog({
  solid,
  onClose,
}: {
  solid: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 overflow-hidden bg-white lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Rechercher un véhicule"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-114 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #008DDE 10.57%, #0025C5 54.59%, #0B1A86 78.78%, #0F0821 100%)",
          }}
        />
        <div
          className="absolute left-1/2 -bottom-44.75 h-84.5 w-1121.5 -translate-x-1/2 rounded-[50%]"
          style={{ background: "#58BAF2", filter: "blur(50px)" }}
        />
        <div
          className="absolute left-1/2 -bottom-23.25 h-47 w-1226.5 -translate-x-1/2 rounded-[50%]"
          style={{ background: "#FFFFFF", filter: "blur(37.5px)" }}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col overflow-y-auto px-4 pb-32 pt-6 overscroll-contain">
        <div className="mb-10 flex items-start justify-between gap-3">
          <h2 className="max-w-62.5 text-[40px] font-bold leading-none tracking-tight text-white">
            Rechercher un véhicule
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la recherche"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm"
          >
            <X className="size-5" />
          </button>
        </div>
        <Suspense fallback={null}>
          <HeaderSearch
            solid={solid}
            className="w-full"
            layout="mobile"
            onSearchComplete={onClose}
          />
        </Suspense>
      </div>
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
            "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
            selected === null
              ? "cursor-default bg-muted font-medium"
              : "cursor-pointer hover:bg-muted"
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
              "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
              selected === o
                ? "cursor-default bg-muted font-medium"
                : "cursor-pointer hover:bg-muted"
            )}
          >
            {o}
          </button>
        </li>
      ))}
    </ul>
  );
}

function getPriceLabel(min: number, max: number): string {
  const option = PRICE_OPTIONS.find((o) => o.min === min && o.max === max);
  return option?.label ?? `${min}–${max}€/sem`;
}

interface PriceOptionsProps {
  min: number;
  max: number;
  dirty: boolean;
  onSelect: (a: number, b: number) => void;
  onClear: () => void;
}

function PriceOptions({
  min,
  max,
  dirty,
  onSelect,
  onClear,
}: PriceOptionsProps) {
  return (
    <ul className="flex flex-col gap-1">
      <li>
        <button
          type="button"
          onClick={onClear}
          className={cn(
            "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
            !dirty
              ? "cursor-default bg-muted font-medium"
              : "cursor-pointer hover:bg-muted"
          )}
        >
          Tous les tarifs
        </button>
      </li>
      {PRICE_OPTIONS.map((option) => {
        const selected = dirty && min === option.min && max === option.max;
        return (
          <li key={option.label}>
            <button
              type="button"
              onClick={() => onSelect(option.min, option.max)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
                selected
                  ? "cursor-default bg-muted font-medium"
                  : "cursor-pointer hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function HeaderNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <nav className="flex flex-col gap-1 py-4">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          onClick={onLinkClick}
        >
          {link.label}
        </a>
      ))}
      <a
        href="/contact/"
        className={cn(buttonVariants(), "mt-2")}
        onClick={onLinkClick}
      >
        Réserver mon véhicule
      </a>
    </nav>
  );
}

function MobileFilterCard({
  label,
  placeholder,
  value,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-[#e7e8ea] bg-white shadow-[0px_6px_9px_rgba(124,124,124,0.12)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span
          className={cn(
            "text-foreground transition-all",
            isOpen
              ? "text-[22px] font-semibold leading-8 tracking-tight"
              : "text-base font-normal leading-6"
          )}
        >
          {label}
        </span>
        {!isOpen && (
          <span className="text-sm font-medium text-foreground">
            {value ?? placeholder}
          </span>
        )}
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        aria-hidden={!isOpen}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "px-4 pb-4 transition-opacity duration-200",
              isOpen ? "opacity-100 delay-100" : "opacity-0"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileOptionList({
  allLabel,
  options,
  selected,
  onSelect,
}: {
  allLabel: string;
  options: readonly string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <MobileOptionButton
          label={allLabel}
          selected={selected === null}
          onClick={() => onSelect(null)}
        />
      </li>
      {options.map((o) => (
        <li key={o}>
          <MobileOptionButton
            label={o}
            selected={selected === o}
            onClick={() => onSelect(o)}
          />
        </li>
      ))}
    </ul>
  );
}

function MobilePriceOptions({
  min,
  max,
  dirty,
  onSelect,
  onClear,
}: PriceOptionsProps) {
  return (
    <ul className="flex flex-col gap-2">
      <li>
        <MobileOptionButton
          label="Tous les tarifs"
          selected={!dirty}
          onClick={onClear}
        />
      </li>
      {PRICE_OPTIONS.map((option) => {
        const isSelected = dirty && min === option.min && max === option.max;
        return (
          <li key={option.label}>
            <MobileOptionButton
              label={option.label}
              selected={isSelected}
              onClick={() => onSelect(option.min, option.max)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function MobileOptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center rounded-2xl p-3 text-sm font-medium transition-colors",
        selected
          ? "bg-foreground text-background"
          : "border border-[#e2e3e5] bg-white text-foreground hover:bg-muted/50"
      )}
    >
      {label}
    </button>
  );
}

export { Header };
export type { HeaderProps, HeaderVariant };
