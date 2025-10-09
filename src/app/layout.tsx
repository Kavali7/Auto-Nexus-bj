import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { CompareBar } from "@/components/compare-bar";
import { CompareProvider } from "@/components/compare-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

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
  icons: {
    icon: "/brand/anx-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <CompareProvider>
          <SiteHeader />
          <main className="pt-24">{children}</main>
          <SiteFooter />
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
