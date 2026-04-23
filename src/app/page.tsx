import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { VehiclesSection } from "@/components/sections/vehicles-section";
import { StepsSection } from "@/components/sections/steps-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { OffersSection } from "@/components/sections/offers-section";
import { ZoneSection } from "@/components/sections/zone-section";
import { FaqSection } from "@/components/sections/faq-section";
import { BlogSection } from "@/components/sections/blog-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";

export const metadata: Metadata = {
  title: "Location véhicule VTC en Île-de-France | Klavem Fleet",
  description:
    "Louez votre véhicule VTC en Île-de-France. 7 000 km/mois, assurance et entretien inclus, véhicule disponible en 48h. Hybrides et électriques dès 29€/jour.",
};

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <VehiclesSection />
      <StepsSection />
      <ComparisonSection />
      <TestimonialsSection />
      <OffersSection />
      <ZoneSection />
      <FaqSection />
      <BlogSection />
      <CtaSection />
      <Footer />
    </>
  );
}
