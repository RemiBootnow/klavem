import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { TestimonialCard } from "@/components/blocks/testimonial-card";

function TestimonialsSection() {
  return (
    <section data-slot="testimonials-section" className="py-24">
      <Container>
        <ContentBlock
          headliner="Témoignages"
          headline="Ils roulent avec Klavem"
        />
      </Container>
      <div className="mt-12 overflow-x-auto scrollbar-hide pl-[max(1.5rem,calc((100vw-1080px)/2+1.5rem))]">
        <TestimonialCard
          testimonials={[
            {
              quote:
                "7 000 km/mois, assurance incluse : je roule sans me poser de questions.",
              name: "Moussa",
              role: "Chauffeur Uber, Paris — chez Klavem depuis 8 mois",
              image: "/testimonials/testimonial 01.jpg",
            },
            {
              quote:
                "Un tarif clair, pas de caution. J'ai signé et roulé en 48h.",
              name: "Sofiane",
              role: "Chauffeur Bolt, Hauts-de-Seine — chez Klavem depuis 5 mois",
              image: "/testimonials/testimonial 02.jpg",
            },
            {
              quote:
                "Panne un dimanche, véhicule de remplacement le lundi matin.",
              name: "Amadou",
              role: "Chauffeur Uber, Val-de-Marne — chez Klavem depuis 11 mois",
              image: "/testimonials/testimonial 03.jpg",
            },
            {
              quote:
                "Entretien, pneus, révisions : je ne m'occupe de rien.",
              name: "Ibrahim",
              role: "Chauffeur Uber, Yvelines — chez Klavem depuis 6 mois",
              image: "/testimonials/testimonial 04.jpg",
            },
            {
              quote:
                "15 jours de préavis, pas de piège. Ici on respecte le chauffeur.",
              name: "Karim",
              role: "Chauffeur Bolt, Seine-Saint-Denis — chez Klavem depuis 9 mois",
              image: "/testimonials/testimonial 05.jpg",
            },
          ]}
        />
      </div>
    </section>
  );
}

export { TestimonialsSection };
