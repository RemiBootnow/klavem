import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/components/container";
import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { CtaSection } from "@/components/sections/cta-section";
import { BlogGallery } from "./blog-gallery";

export const metadata: Metadata = {
  title: "Blog VTC | Klavem Fleet",
  description:
    "Conseils, guides et comparatifs pour choisir, louer et optimiser votre vehicule VTC en Ile-de-France.",
};

export default async function BlogPage({
  searchParams,
}: PageProps<"/blog">) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative isolate overflow-hidden pb-24 pt-32 sm:pt-40">
          <HeroGradient />
          <Container className="relative max-w-7xl">
            <Suspense fallback={null}>
              <BlogGallery searchParams={resolvedSearchParams} />
            </Suspense>
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
        className="absolute left-1/2 -bottom-44.75 h-84.5 w-1121.5 -translate-x-1/2 rounded-[50%]"
        style={{
          background: "#58BAF2",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute left-1/2 -bottom-23.25 h-47 w-1226.5 -translate-x-1/2 rounded-[50%]"
        style={{
          background: "#FFFFFF",
          filter: "blur(37.5px)",
        }}
      />
    </div>
  );
}
