import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { OfferCard } from "@/components/blocks/offer-card";

function OffersSection() {
  return (
    <section data-slot="offers-section" className="py-24">
      <Container>
        <div className="flex flex-col gap-12">
          <ContentBlock headline="Des offres adaptées à votre situation" />
          <OfferCard
            offers={[
              {
                title: "Sans caution",
                description:
                  "Démarrez votre activité VTC sans avancer de caution grâce à notre partenariat Stairling.",
                href: "/offres/location-vtc-sans-caution/",
              },
              {
                title: "Sans engagement long terme",
                description:
                  "Contrat de 6 mois, résiliation sous 15 jours. Testez sans vous engager pour des années.",
                href: "/offres/location-vtc-sans-engagement/",
              },
              {
                title: "Tout inclus",
                description:
                  "Assurance, entretien, pneus, 7 000 km : tout est dans votre loyer. Aucune mauvaise surprise.",
                href: "/offres/location-vtc-tout-inclus/",
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

export { OffersSection };
