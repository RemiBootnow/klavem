"use client";

import { useState } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Headline } from "@/components/components/headline";
import { FallbackImage } from "@/components/components/fallback-image";
import { formatName, formatYears, type Vehicle } from "@/lib/vehicles";

interface VehicleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  vehicle: Vehicle;
}

function VehicleCard({ vehicle, className, ...props }: VehicleCardProps) {
  const name = formatName(vehicle);
  const href = `/vehicules/${vehicle.slug}`;
  const images = vehicle.images.length > 0 ? vehicle.images : [vehicle.image];
  const [idx, setIdx] = useState(0);
  const tarifHebdomadaire =
    vehicle.tarifJournalier !== null ? vehicle.tarifJournalier * 7 : null;

  const stopAndGo = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const goPrev = stopAndGo(() =>
    setIdx((i) => (i === 0 ? images.length - 1 : i - 1))
  );
  const goNext = stopAndGo(() =>
    setIdx((i) => (i === images.length - 1 ? 0 : i + 1))
  );

  return (
    <div
      data-slot="vehicle-card"
      className={cn(
        "group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl bg-muted transition-transform has-[a:active]:scale-[0.98]",
        className
      )}
      {...props}
    >
      <a
        href={href}
        aria-label={name}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-hidden"
      />
      <div className="flex flex-col gap-2 px-6 pt-8">
        <Headline level={3}>{name}</Headline>
        <span className="text-base text-muted-foreground">
          {vehicle.bodyType} de {formatYears(vehicle)}
        </span>
      </div>
      <div className="relative">
        <FallbackImage
          src={images[idx]}
          alt={`${name} — location VTC Île-de-France — Klavem Fleet`}
          className="w-full"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Image précédente"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-black/0 before:transition-colors hover:before:bg-black/5 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Image suivante"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-md transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-black/0 before:transition-colors hover:before:bg-black/5 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <CarouselDots
          count={images.length}
          active={idx}
          onSelect={(i) => setIdx(i)}
          stopAndGo={stopAndGo}
        />
      )}
      <div className="flex items-end justify-between gap-4 px-6 pb-6 pt-4">
        <div className="flex flex-wrap items-baseline gap-x-2">
          {tarifHebdomadaire !== null ? (
            <>
              <span className="text-3xl font-bold tracking-[-0.03em]">
                {tarifHebdomadaire}€
              </span>
              <span className="text-sm text-muted-foreground">
                / semaine TTC
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-[-0.03em]">
                Sur demande
              </span>
              <span className="text-sm text-muted-foreground">
                Tarif hebdomadaire
              </span>
            </>
          )}
        </div>
        <span className="text-sm text-muted-foreground underline underline-offset-4">
          Tout compris
        </span>
      </div>
    </div>
  );
}

const DOT_SIZE = 6;
const DOT_GAP = 4;
const MAX_MAIN_DOTS = 4;

interface CarouselDotsProps {
  count: number;
  active: number;
  onSelect: (i: number) => void;
  stopAndGo: (fn: () => void) => (e: React.MouseEvent) => void;
}

function CarouselDots({
  count,
  active,
  onSelect,
  stopAndGo,
}: CarouselDotsProps) {
  const isCarousel = count > MAX_MAIN_DOTS;
  const shift = isCarousel
    ? Math.max(
        0,
        Math.min(active - (MAX_MAIN_DOTS - 1), count - MAX_MAIN_DOTS)
      )
    : 0;
  const slot = DOT_SIZE + DOT_GAP;
  const windowWidth = isCarousel
    ? MAX_MAIN_DOTS * DOT_SIZE + (MAX_MAIN_DOTS - 1) * DOT_GAP + slot
    : count * DOT_SIZE + (count - 1) * DOT_GAP;

  return (
    <div
      className="relative z-20 mx-auto flex h-2 items-center overflow-hidden"
      style={{ width: `${windowWidth}px` }}
    >
      <div
        className="flex items-center gap-1 transition-transform duration-300"
        style={{ transform: `translateX(-${shift * slot}px)` }}
      >
        {Array.from({ length: count }, (_, i) => {
          const pos = i - shift;
          const isSmall = isCarousel && pos >= MAX_MAIN_DOTS;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === active}
              onClick={stopAndGo(() => onSelect(i))}
              className={cn(
                "shrink-0 rounded-full transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                isSmall ? "h-1.25 w-1.25" : "h-1.5 w-1.5",
                i === active
                  ? "bg-foreground"
                  : "bg-foreground/30 hover:bg-foreground/50"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export { VehicleCard };
export type { VehicleCardProps };
