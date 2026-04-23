"use client";

import { useCallback, useEffect, useState } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FallbackImage } from "@/components/components/fallback-image";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const count = images.length;
  const isOpen = lightboxIndex !== null;

  const openAt = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % count)),
    [count],
  );
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + count) % count)),
    [count],
  );

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  if (count === 0) return null;

  const single = count === 1;
  const double = count === 2;

  return (
    <>
      <div
        className={cn(
          "grid gap-3",
          single && "grid-cols-1",
          double && "grid-cols-2",
          !single && !double && "grid-cols-3 grid-rows-2",
        )}
      >
        <button
          type="button"
          onClick={() => openAt(0)}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-muted",
            "aspect-4/3",
            !single && !double && "col-span-2 row-span-2 aspect-auto",
          )}
          aria-label={`${alt} — photo 1`}
        >
          <FallbackImage
            src={images[0]}
            alt={alt}
            className="h-full w-full object-contain"
          />
        </button>

        {count >= 2 && (
          <button
            type="button"
            onClick={() => openAt(1)}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-muted aspect-4/3",
              count >= 3 && "aspect-auto",
            )}
            aria-label={`${alt} — photo 2`}
          >
            <FallbackImage
              src={images[1]}
              alt={alt}
              className="h-full w-full object-contain"
            />
          </button>
        )}

        {count >= 3 && (
          <button
            type="button"
            onClick={() => openAt(2)}
            className="relative overflow-hidden rounded-2xl bg-muted"
            aria-label={`${alt} — photo 3`}
          >
            <FallbackImage
              src={images[2]}
              alt={alt}
              className="h-full w-full object-contain"
            />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — galerie photos`}
          onClick={close}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Fermer"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Photo précédente"
              className="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-8"
            >
              <CaretLeft size={22} weight="bold" />
            </button>
          )}

          <figure
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full max-w-5xl flex-col items-center gap-3"
          >
            <div className="flex w-full items-center justify-center rounded-xl bg-muted p-4">
              <FallbackImage
                src={images[lightboxIndex]}
                alt={alt}
                className="max-h-[80vh] w-auto max-w-full object-contain"
              />
            </div>
            <figcaption className="text-sm text-white/70">
              {lightboxIndex + 1} / {count}
            </figcaption>
          </figure>

          {count > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Photo suivante"
              className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-8"
            >
              <CaretRight size={22} weight="bold" />
            </button>
          )}
        </div>
      )}
    </>
  );
}

export { VehicleGallery };
