import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageContent } from "@/components/sections/legal-page-content";
import { getLegalPageBySlug } from "@/lib/legal";

const page = getLegalPageBySlug("mentions");

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Klavem Fleet : informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
  alternates: { canonical: "/mentions" },
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  if (!page) notFound();
  return <LegalPageContent page={page} />;
}
