import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CompareBar } from "@/components/compare-bar";
import { CompareProvider, type CompareVehicle } from "@/components/compare-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDealers } from "@/server/dealers";
import { getVehicles } from "@/server/vehicles";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Auto Nexus BJ - MVP statique",
    template: "%s | Auto Nexus BJ",
  },
  description:
    "Prototype Next.js + Tailwind pour la marketplace auto Auto Nexus BJ : vision produit, arborescence et stack technique.",
  creator: "Growpeak Agence",
  applicationName: "Auto Nexus BJ",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicons/favicon-32.png"],
    apple: [{ url: "/favicons/favicon-180.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/favicons/icon-maskable.png",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    title: "Auto Nexus BJ",
    siteName: "Auto Nexus BJ",
    description:
      "Prototype Next.js + Tailwind pour la marketplace auto Auto Nexus BJ : vision produit, arborescence et stack technique.",
    locale: "fr_FR",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Auto Nexus BJ - Marketplace auto premium au Benin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Nexus BJ",
    description:
      "Prototype Next.js + Tailwind pour la marketplace auto Auto Nexus BJ : vision produit, arborescence et stack technique.",
    images: ["/og/og-default.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [vehicles, dealers] = await Promise.all([getVehicles(), getDealers()]);

  const compareVehicles: CompareVehicle[] = vehicles.map((vehicle) => ({
    id: vehicle.id,
    slug: vehicle.slug,
    dealerId: vehicle.dealerId,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim,
    condition: vehicle.condition,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    price: vehicle.price,
    city: vehicle.city,
    heroImage: vehicle.heroImage,
    highlights: vehicle.highlights,
  }));

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <CompareProvider vehicles={compareVehicles} dealers={dealers}>
          <SiteHeader />
          <main className="pt-24">{children}</main>
          <SiteFooter />
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
