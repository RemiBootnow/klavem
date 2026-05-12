import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { ComparisonTable } from "@/components/blocks/comparison-table";

function ComparisonSection() {
  return (
    <section data-slot="comparison-section" className="section-y">
      <Container>
        <div className="flex flex-col gap-8 lg:gap-12">
          <ContentBlock
            centered
            headliner="Comparaison"
            headline="Pourquoi les chauffeurs passent chez Klavem"
          />
          <ComparisonTable
            rows={[
              {
                label: "Kilométrage inclus",
                klavem: "7 000 km/mois",
                others: "5 000 à 6 000 km",
              },
              {
                label: "Tarif semaine",
                klavem: "= mois ÷ 4",
                others: "Majoré de 10 à 15%",
              },
              {
                label: "Assurance VTC",
                klavem: "Incluse",
                others: "À souscrire vous-même",
              },
              {
                label: "Entretien + pneus",
                klavem: "Inclus",
                others: "Souvent à votre charge",
              },
              {
                label: "Résiliation",
                klavem: "15 jours de préavis",
                others: "1 à 3 mois",
              },
              {
                label: "Disponibilité véhicule",
                klavem: "Moins de 48h",
                others: "1 à 2 semaines",
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

export { ComparisonSection };
