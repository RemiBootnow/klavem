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
      <Header />
      <main>
        <section
          data-theme="dark"
          className="relative overflow-hidden pt-24 pb-24 text-white lg:pt-32"
        >
          <HeroGradient />
          <Container className="max-w-7xl">
            <div className="flex flex-col gap-8 lg:gap-12">
              <ContentBlock
                headline={
                  <>
                    Quelle véhicule
                    <br />
                    voulez-vous conduire ?
                  </>
                }
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

function HeroGradient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[403px] overflow-hidden"
      style={{
        background:
          "linear-gradient(0deg, #008DDE 10.57%, #0025C5 54.59%, #0B1A86 78.78%, #0F0821 100%)",
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-44.75 w-1121.5 h-84.5 rounded-[50%]"
        style={{
          background: "#58BAF2",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-23.25 w-1226.5 h-47 rounded-[50%]"
        style={{
          background: "#FFFFFF",
          filter: "blur(37.5px)",
        }}
      />
    </div>
  );
}
