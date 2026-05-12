import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CalendarX,
  Lightning,
  MapPin,
  ShieldCheck,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/components/container";
import { Headline } from "@/components/components/headline";
import { ContentBlock } from "@/components/blocks/content-block";
import { VehicleCard } from "@/components/blocks/vehicle-card";
import { VehicleGallery } from "@/components/blocks/vehicle-gallery";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faq-section";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  formatName,
  formatYears,
  getBodyCategory,
  getRelatedVehicles,
  getVehicleBySlug,
  vehicles,
  type Motorisation,
  type Vehicle,
} from "@/lib/vehicles";
import { ContactCta } from "./contact-cta";
import { ExpandableText } from "./expandable-text";
import { PriceToggle } from "./price-toggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) return { title: "Véhicule introuvable | Klavem Fleet" };

  const name = formatName(vehicle);
  return {
    title: `${name} — Location VTC | Klavem Fleet`,
    description: `Louez le ${name} (${vehicle.bodyType}, ${vehicle.motorisation.toLowerCase()}) en Île-de-France. Entretien et assurance inclus.`,
  };
}

const INCLUSIONS = [
  { icon: MapPin, label: "7 000 km inclus" },
  { icon: ShieldCheck, label: "Assurance tous risques VTC incluse" },
  { icon: Wrench, label: "Entretien et pneus pris en charge" },
  { icon: Lightning, label: "Véhicule prêt en 48h" },
  { icon: CalendarX, label: "Résiliation en 15 jours" },
];

const FUEL_BY_MOTORISATION: Partial<Record<Motorisation, string>> = {
  Hybride: "Essence",
};

function getSubtitle(v: Vehicle): string {
  const parts = [getBodyCategory(v), v.motorisation];
  const fuel = FUEL_BY_MOTORISATION[v.motorisation];
  if (fuel) parts.push(fuel);
  return parts.join(" ");
}

function HeroGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-60 -z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(0deg, #008DDE 10.57%, #0025C5 54.59%, #0B1A86 78.78%, #0F0821 100%)",
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-44.75 w-1121.5 h-84.5 rounded-[50%]"
        style={{
          background: "#58BAF2",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-23.25 w-1226.5 h-47 rounded-[50%]"
        style={{
          background: "#FFFFFF",
          filter: "blur(37.5px)",
        }}
      />
    </div>
  );
}

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const name = formatName(vehicle);
  const years = formatYears(vehicle);
  const subtitle = getSubtitle(vehicle);
  const related = getRelatedVehicles(vehicle, 3);

  const specRows = [
    { label: "Type de véhicule", value: getBodyCategory(vehicle) },
    { label: "Motorisation", value: vehicle.motorisation },
    { label: "Année", value: years },
    { label: "Catégorie", value: String(vehicle.category) },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-screen pt-24 pb-12 lg:pt-32">
          <HeroGradient />
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
              <VehicleGallery images={vehicle.images} alt={name} />

              <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-foreground lg:text-base">
                    {subtitle}
                  </span>
                  <Headline
                    level={1}
                    className="text-3xl font-bold tracking-tight lg:text-4xl lg:leading-tight"
                  >
                    {name}
                  </Headline>
                  {vehicle.description && (
                    <ExpandableText className="text-sm leading-relaxed text-muted-foreground">
                      {vehicle.description}
                    </ExpandableText>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <PriceToggle daily={vehicle.tarifJournalier} />

                  <ContactCta vehicleSlug={vehicle.slug} />
                </div>

                <ul className="flex flex-col gap-4 rounded-2xl border border-border p-6">
                  {INCLUSIONS.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 text-sm text-foreground"
                    >
                      <Icon
                        size={22}
                        weight="fill"
                        className="shrink-0 text-primary"
                      />
                      {label}
                    </li>
                  ))}
                </ul>

                <dl className="flex flex-col gap-1">
                  {specRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-[8px] px-2 py-1.5 text-sm",
                        i % 2 === 1 && "bg-muted/60",
                      )}
                    >
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="font-medium text-right">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </Container>
        </section>

        {related.length > 0 && (
          <section className="section-y">
            <Container>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <ContentBlock
                    headline="Autres modèles"
                    paragraph="Découvrez d'autres véhicules de notre flotte adaptés au VTC."
                  />
                  <a
                    href="/vehicules/"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Voir tous les véhicules
                  </a>
                </div>
                <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide px-6 scroll-pl-6 max-[393px]:-mx-4 max-[393px]:px-4 max-[393px]:scroll-pl-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
                  {related.map((v) => (
                    <div
                      key={v.slug}
                      className="w-90 shrink-0 snap-start sm:w-auto"
                    >
                      <VehicleCard vehicle={v} />
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        <FaqSection />

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
