import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/components/container";
import { ContentBlock } from "@/components/blocks/content-block";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { VehiclesGallery } from "./vehicles-gallery";

export const metadata: Metadata = {
  title: "Tous nos véhicules VTC | Klavem Fleet",
  description:
    "Découvrez notre flotte complète de véhicules VTC hybrides et électriques disponibles à la location en Île-de-France.",
};

export default function VehiculesPage() {
  return (
    <>
      <Header variant="light" />
      <main>
        <section className="pt-32 pb-24">
          <Container className="max-w-7xl">
            <div className="flex flex-col gap-12">
              <ContentBlock
                headline="Tous nos véhicules"
                paragraph="Hybrides, électriques et diesel, compatibles Uber, Bolt et toutes les plateformes VTC."
              />
              <Suspense fallback={null}>
                <VehiclesGallery />
              </Suspense>
            </div>
          </Container>
        </section>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
