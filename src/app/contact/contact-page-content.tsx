"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarX,
  Lightning,
  MapPin,
  ShieldCheck,
  Wrench,
} from "@phosphor-icons/react";
import { formatName, type Vehicle } from "@/lib/vehicles";
import { ContactForm, UNDECIDED } from "./contact-form";

interface VehicleOption {
  slug: string;
  name: string;
  bodyType: string;
  yearLabel: string;
  category: number;
  tarifJournalier: number | null;
  image: string;
}

const INCLUSIONS = [
  { icon: MapPin, label: "7 000 km inclus" },
  { icon: ShieldCheck, label: "Assurance tous risques VTC incluse" },
  { icon: Wrench, label: "Entretien et pneus pris en charge" },
  { icon: Lightning, label: "Véhicule prêt en 48h" },
  { icon: CalendarX, label: "Résiliation en 15 jours" },
];

interface ContactPageContentProps {
  formVehicles: VehicleOption[];
  vehicles: Vehicle[];
  initialVehicleSlug: string | null;
}

function ContactPageContent({
  formVehicles,
  vehicles,
  initialVehicleSlug,
}: ContactPageContentProps) {
  const [currentSlug, setCurrentSlug] = useState<string | null>(
    initialVehicleSlug
  );

  const selectedVehicle = useMemo(() => {
    if (!currentSlug || currentSlug === UNDECIDED) return undefined;
    return vehicles.find((v) => v.slug === currentSlug);
  }, [currentSlug, vehicles]);

  function handleVehicleChange(slug: string) {
    setCurrentSlug(slug || null);
  }

  if (!selectedVehicle) {
    return (
      <FormCard>
        <ContactForm
          vehicles={formVehicles}
          initialVehicleSlug={initialVehicleSlug}
          onVehicleChange={handleVehicleChange}
        />
        <FormFooter />
      </FormCard>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_520px] lg:items-start lg:gap-24">
      <VehicleShowcase vehicle={selectedVehicle} />
      <FormCard>
        <ContactForm
          vehicles={formVehicles}
          initialVehicleSlug={initialVehicleSlug}
          onVehicleChange={handleVehicleChange}
        />
        <FormFooter />
      </FormCard>
    </div>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:rounded-3xl lg:border lg:border-border lg:bg-background lg:p-8 lg:shadow-sm">
      {children}
    </div>
  );
}

function FormFooter() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      Réponse en moins de 2h ouvrées · contact@klavem.fr · 01 89 62 31 22
    </p>
  );
}

function VehicleShowcase({ vehicle }: { vehicle: Vehicle }) {
  const weekly =
    vehicle.tarifJournalier !== null ? vehicle.tarifJournalier * 7 : null;
  return (
    <div className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-10">
      <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground">
        Louer votre {vehicle.brand} {vehicle.model}
        {weekly !== null ? (
          <>
            {" "}
            dès <span className="text-primary">{weekly}€/semaine</span>
          </>
        ) : null}
      </h1>
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Image
          src={vehicle.image}
          alt={formatName(vehicle)}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="scale-125 object-contain"
        />
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {INCLUSIONS.slice(0, 4).map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 text-sm text-foreground"
          >
            <Icon size={22} weight="fill" className="shrink-0 text-primary" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { ContactPageContent };
