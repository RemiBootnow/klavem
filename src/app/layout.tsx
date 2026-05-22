import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { DevTools } from "@/components/components/dev-tools";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://klavem.fr";
const SITE_NAME = "Klavem Fleet";
const DEFAULT_DESCRIPTION =
  "Location de véhicules VTC en Île-de-France. Hybrides et électriques, assurance et entretien inclus, 7 000 km/mois, véhicule disponible en 48h.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Location véhicule VTC en Île-de-France | Klavem Fleet",
    template: "%s | Klavem Fleet",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Location véhicule VTC en Île-de-France | Klavem Fleet",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Location véhicule VTC en Île-de-France | Klavem Fleet",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0821",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: "contact@klavem.fr",
  telephone: "+33189623122",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Île-de-France",
  },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Île-de-France",
    addressCountry: "FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${figtree.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <DevTools />
      </body>
    </html>
  );
}
