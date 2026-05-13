import Image from "next/image";
import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { StatsBar } from "@/components/blocks/stats-bar";

function HeroSection() {
  return (
    <section
      data-slot="hero-section"
      data-theme="dark"
      className="relative bg-[#0F0821] text-white lg:flex lg:min-h-[calc(100vh+200px)] lg:flex-col"
    >
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden lg:absolute lg:inset-0 lg:min-h-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 -z-10 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, #0F0821 0%, #004276 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 top-1/3 -z-10 overflow-hidden lg:top-0">
          <Image
            src="/home/hero/big-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-bottom lg:object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/4 lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, #014276 0%, rgba(1, 66, 118, 0) 100%)",
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-50 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(21, 11, 45, 0.00) 0%, rgba(21, 11, 45, 0.90) 60%, #0F0821 100%)",
          }}
        />
        <div className="pt-24 lg:pt-34">
          <Container size="sm">
            <ContentBlock
              centered
              headlineLevel={1}
              headline="Louez votre véhicule VTC en Île-de-France"
              paragraph="Hybrides et électriques, tout inclus : assurance, entretien et 7 000 km/mois. Véhicule disponible en 48h."
              actions={[
                {
                  label: "Je réserve mon véhicule",
                  href: "/vehicules",
                  variant: "secondary",
                  size: "xl" as const,
                },
              ]}
            />
          </Container>
        </div>
      </div>
      <div className="relative py-12 lg:mt-auto lg:pb-16 lg:pt-0">
        <Container size="sm">
          <StatsBar
            stats={[
              { value: "+350", label: "véhicules disponibles" },
              { value: "7 000 km", label: "inclus chaque mois" },
              { value: "48h", label: "pour démarrer" },
              { value: "15 jours", label: "de préavis — sans engagement long terme" },
            ]}
            className="[&_span]:text-white"
          />
        </Container>
      </div>
    </section>
  );
}

export { HeroSection };
