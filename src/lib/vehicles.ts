import data from "../../content/vehicles.json";

export type Motorisation = "Hybride" | "Électrique" | "Diesel";
export type Transmission = "Automatique" | "Manuelle";

export interface Vehicle {
  slug: string;
  brand: string;
  model: string;
  variant: string | null;
  bodyType: string;
  yearFrom: number;
  yearTo: number;
  motorisation: Motorisation;
  transmission: Transmission;
  consommation: string | null;
  tempsCharge: string | null;
  autonomie: number | null;
  coffre: number;
  places: number;
  category: number;
  image: string;
  images: string[];
  description: string;
  tarifJournalier: number | null;
}

export const vehicles: Vehicle[] = data as Vehicle[];

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getRelatedVehicles(vehicle: Vehicle, max = 3): Vehicle[] {
  return vehicles.filter((v) => v.slug !== vehicle.slug).slice(0, max);
}

export function formatYears(v: Vehicle): string {
  return v.yearFrom === v.yearTo ? `${v.yearFrom}` : `${v.yearFrom}–${v.yearTo}`;
}

export function formatName(v: Vehicle): string {
  return v.variant
    ? `${v.brand} ${v.model} ${v.variant}`
    : `${v.brand} ${v.model}`;
}

export function getBodyCategory(v: Vehicle): string {
  return v.bodyType.split(" ")[0];
}

export const BODY_CATEGORIES: string[] = [
  ...new Set(vehicles.map(getBodyCategory)),
].sort();

export const VEHICLE_BRANDS: string[] = [
  ...new Set(vehicles.map((v) => v.brand)),
].sort();

export const MOTORISATIONS: Motorisation[] = [
  ...new Set(vehicles.map((v) => v.motorisation)),
].sort() as Motorisation[];

export const CATEGORIES: number[] = [
  ...new Set(vehicles.map((v) => v.category)),
].sort((a, b) => a - b);

export const SHOWCASE_COLORS = ["black", "white", "grey"] as const;
export type ShowcaseColor = (typeof SHOWCASE_COLORS)[number];

export function parseShowcaseColor(
  value: string | string[] | undefined
): ShowcaseColor {
  const raw = Array.isArray(value) ? value[0] : value;
  return (SHOWCASE_COLORS as readonly string[]).includes(raw ?? "")
    ? (raw as ShowcaseColor)
    : "black";
}

export function applyColorVariant(
  vehicle: Vehicle,
  color: ShowcaseColor
): Vehicle {
  if (color === "black") return vehicle;
  const suffix = `-${color}`;
  const swap = (src: string) =>
    src.replace(/\/([123])\.png$/, `/$1${suffix}.png`);
  return {
    ...vehicle,
    image: swap(vehicle.image),
    images: vehicle.images.map(swap),
  };
}
