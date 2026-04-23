import Image from "next/image";
import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { StatsBar } from "@/components/blocks/stats-bar";

function HeroSection() {
  return (
    <section data-slot="hero-section" data-theme="dark" className="relative flex min-h-screen lg:min-h-[calc(100vh+200px)] flex-col text-white">
      <Image
        src="/home/hero/big-hero.jpg"
        alt=""
        fill
        priority
        className="object-cover -z-10"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(21, 11, 45, 0.00) 0%, rgba(21, 11, 45, 0.00) 35%, rgba(21, 11, 45, 0.90) 75%, #0F0821 100%)",
        }}
      />
      <div className="pt-[calc(4rem+32px)]">
        <Container size="sm">
          <ContentBlock
            centered
            headlineLevel={1}
            headline="Louez votre véhicule VTC en Île-de-France"
            paragraph="Hybrides et électriques, tout inclus : assurance, entretien et 7 000 km/mois. Véhicule disponible en 48h."
            actions={[
              { label: "Je réserve mon véhicule", href: "/contact", size: "xl" as const },
            ]}
          />
        </Container>
      </div>
      <div className="mt-auto pb-16">
        <Container>
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
