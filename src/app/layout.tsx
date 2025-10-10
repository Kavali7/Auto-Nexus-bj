import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CompareBar } from "@/components/compare-bar";
import {
  CompareProvider,
  type CompareVehicle,
} from "@/components/compare-context";
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
    default: "Auto Nexus BJ — MVP statique",
    template: "%s | Auto Nexus BJ",
  },
  description:
    "Prototype Next.js + Tailwind pour la marketplace auto Auto Nexus BJ : vision produit, arborescence et stack technique.",
  creator: "Growpeak Agence",
  icons: {
    icon: "/brand/anx-logo.png",
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
