import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/components/container";
import { Logo } from "@/components/components/logo";
import { buttonVariants } from "@/components/components/ui/button-variants";
import {
  vehicles,
  getVehicleBySlug,
  formatName,
  formatYears,
} from "@/lib/vehicles";
import { ContactPageContent } from "./contact-page-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Klavem Fleet pour louer votre véhicule VTC en Île-de-France. Réponse en moins de 2h ouvrées. Tél. 01 89 62 31 22.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | Klavem Fleet",
    description:
      "Contactez Klavem Fleet pour louer votre véhicule VTC en Île-de-France. Réponse en moins de 2h ouvrées.",
  },
};

const formVehicles = vehicles.map((v) => ({
  slug: v.slug,
  name: formatName(v),
  bodyType: v.bodyType,
  yearLabel: formatYears(v),
  category: v.category,
  tarifJournalier: v.tarifJournalier,
  image: v.image,
}));

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>;
}) {
  const { vehicle: vehicleSlug } = await searchParams;
  const initialVehicle = vehicleSlug
    ? getVehicleBySlug(vehicleSlug)
    : undefined;
  const initialVehicleSlug = initialVehicle?.slug ?? null;

  return (
    <main className="min-h-screen bg-muted/40 lg:bg-muted">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur lg:bg-muted lg:backdrop-blur-none">
        <Container className="max-w-7xl">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" aria-label="Retour à l'accueil Klavem">
              <Logo />
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="tel:+33189623122"
                aria-label="Appeler le 01 89 62 31 22"
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className:
                    "group/call w-42 overflow-hidden bg-muted text-foreground lg:bg-background",
                })}
              >
                <Phone size={16} weight="bold" />
                <span className="relative inline-grid w-29 overflow-hidden text-center">
                  <span className="transition-transform duration-200 group-hover/call:-translate-y-full">
                    Nous contacter
                  </span>
                  <span className="absolute inset-0 translate-y-full transition-transform duration-200 group-hover/call:translate-y-0">
                    01 89 62 31 22
                  </span>
                </span>
              </a>
            </div>
          </div>
        </Container>
      </header>

      <section className="py-10 sm:py-14">
        <Container className="max-w-110 lg:max-w-7xl">
          <ContactPageContent
            formVehicles={formVehicles}
            vehicles={vehicles}
            initialVehicleSlug={initialVehicleSlug}
          />
        </Container>
      </section>
    </main>
  );
}
