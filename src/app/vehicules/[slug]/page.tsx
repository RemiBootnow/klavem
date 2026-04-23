import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  GasPump,
  Leaf,
  Lightning,
  Medal,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/components/container";
import { Headline } from "@/components/components/headline";
import { Headliner } from "@/components/components/headliner";
import { ContentBlock } from "@/components/blocks/content-block";
import { VehicleCard } from "@/components/blocks/vehicle-card";
import { VehicleGallery } from "@/components/blocks/vehicle-gallery";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { buttonVariants } from "@/components/components/ui/button-variants";
import {
  formatName,
  formatYears,
  getRelatedVehicles,
  getVehicleBySlug,
  vehicles,
  type Motorisation,
} from "@/lib/vehicles";

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

const MOTORISATION_ICON: Record<Motorisation, typeof Lightning> = {
  Électrique: Lightning,
  Hybride: Leaf,
  Diesel: GasPump,
};

const INCLUSIONS = [
  "Entretien constructeur",
  "Assurance omnium",
  "Assistance 24/7",
  "Pneus été & hiver",
];

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const name = formatName(vehicle);
  const years = formatYears(vehicle);
  const related = getRelatedVehicles(vehicle, 3);
  const MotoIcon = MOTORISATION_ICON[vehicle.motorisation];

  return (
    <>
      <Header variant="light" />
      <main>
        <section className="pt-32 pb-12">
          <div className="mx-auto w-full px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <VehicleGallery images={vehicle.images} alt={name} />

                <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-background p-5 sm:grid-cols-3">
                  <SpecHighlight
                    icon={<MotoIcon size={22} weight="duotone" />}
                    label="Motorisation"
                    value={vehicle.motorisation}
                  />
                  <SpecHighlight
                    icon={<Calendar size={22} weight="duotone" />}
                    label="Années"
                    value={years}
                  />
                  <SpecHighlight
                    icon={<Medal size={22} weight="duotone" />}
                    label="Catégorie"
                    value={`Catégorie ${vehicle.category}`}
                  />
                </dl>
              </div>

              <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
                <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-6">
                  <div className="flex flex-col gap-1">
                    <Headliner>{vehicle.brand}</Headliner>
                    <Headline
                      level={1}
                      className="text-2xl font-bold tracking-tight lg:text-2xl lg:leading-tight"
                    >
                      {name}
                    </Headline>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.bodyType} · {years}
                    </p>
                  </div>

                  <dl className="flex flex-col divide-y divide-border text-sm">
                    <InfoRow label="Carrosserie" value={vehicle.bodyType} />
                    <InfoRow label="Motorisation" value={vehicle.motorisation} />
                    <InfoRow label="Années" value={years} />
                    <InfoRow
                      label="Catégorie"
                      value={`Catégorie ${vehicle.category}`}
                    />
                  </dl>

                  {vehicle.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {vehicle.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between border-t border-border pt-4">
                      <span className="text-sm text-muted-foreground">
                        Tarif journalier
                      </span>
                      {vehicle.tarifJournalier !== null ? (
                        <span>
                          <span className="text-2xl font-bold">
                            {vehicle.tarifJournalier} €
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {" "}/ jour TTC
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm font-medium">Sur demande</span>
                      )}
                    </div>
                    <a
                      href="/contact/"
                      className={buttonVariants({
                        variant: "default",
                        size: "xl",
                        className: "w-full",
                      })}
                    >
                      Choisir ce véhicule
                    </a>
                    <Link
                      href="/contact/"
                      className={buttonVariants({
                        variant: "outline",
                        className: "w-full",
                      })}
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      Contacter Klavem
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-6">
                  <span className="text-sm font-semibold text-foreground">
                    Inclus dans la location
                  </span>
                  <ul className="flex flex-col gap-2 text-sm text-foreground/80">
                    {INCLUSIONS.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle
                          size={18}
                          weight="fill"
                          className="text-primary"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pb-24">
            <Container>
              <div className="flex flex-col gap-10">
                <ContentBlock
                  headline={`Autres modèles ${vehicle.brand}`}
                  paragraph="Comparez les autres véhicules de la même marque dans notre flotte."
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((v) => (
                    <VehicleCard key={v.slug} vehicle={v} />
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}

function SpecHighlight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
        {icon}
      </div>
      <div className="flex flex-col">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}
