import { Container } from "@/components/components/container";
import { StatsBar } from "@/components/blocks/stats-bar";

function StatsSection() {
  return (
    <section data-slot="stats-section" className="py-16">
      <Container>
        <StatsBar
          stats={[
            { value: "+350", label: "véhicules disponibles" },
            { value: "7 000 km", label: "inclus chaque mois" },
            { value: "48h", label: "pour démarrer" },
            { value: "15 jours", label: "de préavis — sans engagement long terme" },
          ]}
        />
      </Container>
    </section>
  );
}

export { StatsSection };
