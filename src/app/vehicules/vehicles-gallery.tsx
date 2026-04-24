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
    () => ({
      type: searchParams.get("type") ?? null,
      motorisation: searchParams.get("motorisation") ?? null,
    }),
    [searchParams]
  );

  const resetFilters = useCallback(() => {
    router.replace("/vehicules", { scroll: false });
  }, [router]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (selected.type && selected.type !== getBodyCategory(v)) return false;
      if (selected.motorisation && selected.motorisation !== v.motorisation)
        return false;
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
            className={buttonVariants({ variant: "outline" })}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}

export { VehiclesGallery };
