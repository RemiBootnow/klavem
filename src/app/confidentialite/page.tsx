import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/sections/legal-page-content";
import { getLegalPageBySlug } from "@/lib/legal";

const page = getLegalPageBySlug("confidentialite");

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et de cookies de Klavem Fleet : gestion et protection de vos données personnelles conformément au RGPD.",
  alternates: { canonical: "/confidentialite" },
  robots: { index: true, follow: true },
};

export default function ConfidentialitePage() {
  if (!page) notFound();
  return <LegalPageContent page={page} />;
}
