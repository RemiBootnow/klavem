"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { VehicleCard } from "@/components/blocks/vehicle-card";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { BRANDS, MOTORISATIONS, vehicles } from "@/lib/vehicles";

type FilterKey = "brand" | "motorisation";

const ALL = "__all__";

function VehiclesGallery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = useMemo(
    () => ({
      brand: searchParams.get("brand") ?? null,
      motorisation: searchParams.get("motorisation") ?? null,
    }),
    [searchParams]
  );

  const updateFilter = useCallback(
    (key: FilterKey, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);

      const qs = params.toString();
      router.replace(qs ? `/vehicules?${qs}` : "/vehicules", { scroll: false });
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.replace("/vehicules", { scroll: false });
  }, [router]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (selected.brand && selected.brand !== v.brand) return false;
      if (selected.motorisation && selected.motorisation !== v.motorisation)
        return false;
      return true;
    });
  }, [selected]);

  const hasActiveFilters = Boolean(selected.brand || selected.motorisation);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="Marque"
          placeholder="Toutes les marques"
          options={BRANDS}
          value={selected.brand}
          onChange={(v) => updateFilter("brand", v)}
        />
        <FilterSelect
          label="Motorisation"
          placeholder="Toutes les motorisations"
          options={MOTORISATIONS as unknown as string[]}
          value={selected.motorisation}
          onChange={(v) => updateFilter("motorisation", v)}
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

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

interface FilterSelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <Select.Root
        value={value ?? ALL}
        onValueChange={(v) => onChange(v === ALL ? null : (v as string))}
      >
        <Select.Trigger
          className={cn(
            "inline-flex min-w-52 items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground",
            "transition-colors hover:bg-muted/60 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <Select.Value>
            {(val) => (val && val !== ALL ? (val as string) : placeholder)}
          </Select.Value>
          <Select.Icon>
            <CaretDown size={16} weight="bold" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            sideOffset={6}
            align="start"
            className="z-50 outline-hidden"
          >
            <Select.Popup
              className={cn(
                "max-h-[min(var(--available-height),20rem)] min-w-(--anchor-width) overflow-y-auto rounded-md border border-border bg-background p-1 text-sm shadow-lg",
                "data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity"
              )}
            >
              <SelectItem value={ALL}>Toutes</SelectItem>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Select.Item
      value={value}
      className={cn(
        "flex cursor-pointer select-none items-center justify-between gap-2 rounded px-2 py-1.5 text-sm outline-hidden",
        "data-highlighted:bg-muted data-selected:font-semibold"
      )}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <Check size={14} weight="bold" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

export { VehiclesGallery };
