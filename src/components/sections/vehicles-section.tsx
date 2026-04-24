import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { VehicleCard } from "@/components/blocks/vehicle-card";
import { buttonVariants } from "@/components/components/ui/button-variants";
import { vehicles } from "@/lib/vehicles";

function VehiclesSection() {
  const featured = vehicles.slice(0, 3);

  return (
    <section data-slot="vehicles-section" className="pt-0 pb-24">
      <Container>
        <div className="flex flex-col gap-12">
          <ContentBlock
            centered
            headliner="Nos véhicules"
            headline="Nos véhicules"
            paragraph="Hybrides et électriques, compatibles Uber, Bolt et toutes les plateformes VTC."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v.slug} vehicle={v} />
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="/vehicules"
              className={buttonVariants({ variant: "secondary" })}
            >
              Voir tous les véhicules
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { VehiclesSection };
