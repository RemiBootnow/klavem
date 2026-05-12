import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { FaqList } from "@/components/blocks/faq-list";

const faqItems = [
  {
    question: "Faut-il une carte VTC pour louer un véhicule chez Klavem ?",
    answer:
      "Oui, la carte professionnelle VTC est nécessaire pour louer un véhicule chez Klavem. Si votre carte est en cours d'obtention, contactez-nous pour en discuter.",
  },
  {
    question:
      "Combien coûte la location d'un véhicule VTC chez Klavem ?",
    answer:
      "Nos tarifs démarrent à 350€/semaine TTC, tout inclus : assurance tous risques VTC, entretien, pneus et 7 000 km/mois. Consultez notre grille tarifaire complète sur la page Tarifs.",
  },
  {
    question: "Puis-je résilier mon contrat à tout moment ?",
    answer:
      "Le contrat initial est de 6 mois. Après cette période, vous pouvez résilier avec un préavis de 15 jours. Pas de pénalité, pas de frais cachés.",
  },
  {
    question: "Quelles plateformes VTC sont compatibles ?",
    answer:
      "Tous nos véhicules sont compatibles avec Uber, Bolt, Heetch et l'ensemble des plateformes de transport VTC.",
  },
];

function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function FaqSection() {
  return (
    <section data-slot="faq-section" className="section-y">
      <FaqJsonLd />
      <Container size="md">
        <div className="flex flex-col items-center gap-8 lg:gap-12">
          <ContentBlock headline="Questions fréquentes" />
          <FaqList items={faqItems} className="w-full max-w-180" />
        </div>
      </Container>
    </section>
  );
}

export { FaqSection };
