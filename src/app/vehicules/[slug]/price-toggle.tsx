"use client";

import { useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { Select } from "@base-ui/react/select";
import { cn } from "@/lib/utils";

type PriceUnit = "day" | "week" | "month";

const UNITS: Record<PriceUnit, { multiplier: number; label: string }> = {
  day: { multiplier: 1, label: "/jour TTC" },
  week: { multiplier: 7, label: "/semaine TTC" },
  month: { multiplier: 30, label: "/mois TTC" },
};

interface PriceToggleProps {
  daily: number | null;
}

function PriceToggle({ daily }: PriceToggleProps) {
  const [unit, setUnit] = useState<PriceUnit>("week");

  if (daily === null) {
    return (
      <span className="text-3xl font-bold tracking-[-0.03em]">Sur demande</span>
    );
  }

  const amount = daily * UNITS[unit].multiplier;

  return (
    <Select.Root
      value={unit}
      onValueChange={(v) => setUnit(v as PriceUnit)}
    >
      <Select.Trigger className="inline-flex cursor-pointer items-baseline gap-2 rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
        <span className="text-3xl font-bold tracking-[-0.03em]">
          {amount}€
        </span>
        <span className="text-base text-muted-foreground">
          {UNITS[unit].label}
        </span>
        <Select.Icon>
          <CaretDown
            size={18}
            weight="bold"
            className="ml-1 text-muted-foreground"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          sideOffset={8}
          align="start"
          className="z-50 outline-hidden"
        >
          <Select.Popup
            className={cn(
              "min-w-44 overflow-hidden rounded-2xl border border-border bg-background p-1 text-sm shadow-lg",
              "data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity",
            )}
          >
            {(Object.keys(UNITS) as PriceUnit[]).map((key) => (
              <Select.Item
                key={key}
                value={key}
                className={cn(
                  "flex cursor-pointer select-none items-center justify-between gap-3 rounded-md px-3 py-2 outline-hidden",
                  "data-highlighted:bg-muted data-selected:font-semibold",
                )}
              >
                <Select.ItemText>
                  {daily * UNITS[key].multiplier}€ {UNITS[key].label}
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} weight="bold" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export { PriceToggle };
