"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VehicleCard } from "@/components/blocks/vehicle-card";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { getBodyCategory, vehicles } from "@/lib/vehicles";

function VehiclesGallery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = useMemo(
    () => {
      const rawMin = Number(searchParams.get("min"));
      const rawMax = Number(searchParams.get("max"));
      return {
        brand: searchParams.get("brand") ?? null,
        type: searchParams.get("type") ?? null,
        motorisation:
          searchParams.get("motorisation") ?? searchParams.get("moto") ?? null,
        priceMin: Number.isFinite(rawMin) && rawMin > 0 ? rawMin : null,
        priceMax: Number.isFinite(rawMax) && rawMax > 0 ? rawMax : null,
      };
    },
    [searchParams]
  );

  const resetFilters = useCallback(() => {
    router.replace("/vehicules", { scroll: false });
  }, [router]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (selected.brand && selected.brand !== v.brand) return false;
      if (selected.type && selected.type !== getBodyCategory(v)) return false;
      if (selected.motorisation && selected.motorisation !== v.motorisation)
        return false;
      if (selected.priceMin !== null || selected.priceMax !== null) {
        if (v.tarifJournalier === null) return false;
        const weeklyPrice = v.tarifJournalier * 7;
        if (selected.priceMin !== null && weeklyPrice < selected.priceMin)
          return false;
        if (selected.priceMax !== null && weeklyPrice > selected.priceMax)
          return false;
      }
      return true;
    });
  }, [selected]);

  return (
    <div className="flex flex-col gap-10">
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">
            Aucun véhicule ne correspond à votre sélection.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className={buttonVariants({ variant: "secondary" })}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}

export { VehiclesGallery };
