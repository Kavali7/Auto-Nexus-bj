import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { VehiclesExplorer } from "@/components/vehicles-explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDealers } from "@/server/dealers";
import { getVehicles } from "@/server/vehicles";
import { formatPriceXof } from "@/lib/format";

export const metadata: Metadata = {
  title: "Voitures disponibles",
  description:
    "Listing statique Auto Nexus BJ : filtres mock Meilisearch, cartes premium et comparateur pret pour la phase 2.",
};

export default async function VehiclesPage(): Promise<JSX.Element> {
  const [vehicles, dealers] = await Promise.all([getVehicles(), getDealers()]);

  const totalInventoryValue = vehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);

  const stats = [
    {
      label: "Vehicules disponibles",
      value: vehicles.length.toString().padStart(2, "0"),
      hint: "Dataset photo-ready pour le comparateur",
    },
    {
      label: "Concessionnaires pilotes",
      value: dealers.length.toString().padStart(2, "0"),
      hint: "Stocks synchronises dans le MVP",
    },
    {
      label: "Valeur stock simulee",
      value: formatPriceXof(totalInventoryValue),
      hint: "GMV de reference pour les reportings",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="relative isolate overflow-hidden border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
        <AnimatedSection className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="space-y-8">
              <Badge className="w-fit bg-brand/15 text-brand">Catalogue live</Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Explorez le showroom Auto Nexus BJ
                </h1>
                <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                  Filtrez le dataset mock pour valider l experience Meilisearch, tester le
                  comparateur multi-vehicules et suivre les CTA WhatsApp integres dans le
                  MVP.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Badge variant="outline" className="border-border/70">
                  Mock Meilisearch
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Comparateur ready
                </Badge>
                <Badge variant="outline" className="border-border/70">
                  Lead WhatsApp
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/comparer">Lancer le comparateur</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20une%20demo%20listing%20Auto%20Nexus%20BJ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Planifier une demo
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="#listing">Parcourir le listing</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Objectif catalogue</p>
                  <p>
                    Consolider un inventaire photo-ready, synchroniser les stocks pilotes
                    et preparer la connexion Supabase et Meilisearch pour la recherche
                    temps reel.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/95 shadow-lg">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-1">
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground/80">{stat.hint}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="listing" className="flex flex-1 bg-muted/15 py-16">
        <div className="mx-auto w-full max-w-6xl space-y-16 px-6">
          <VehiclesExplorer vehicles={vehicles} dealers={dealers} />

          <AnimatedSection
            delay={0.1}
            className="grid gap-8 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.5fr_1fr]"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Roadmap Phase 2 : live comparateur et favoris
              </h2>
              <p className="text-base text-muted-foreground">
                Cette base statique sera connectee a Meilisearch pour activer la recherche
                tolerante, les favoris personnalises et le tableau de comparaison enrichi
                (PDF, partage, analytics).
              </p>
              <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.18em] text-brand">
                  Sprint a venir
                </p>
                <ul className="mt-2 space-y-1">
                  <li>- Sticky bar multi-compare et favoris persistants</li>
                  <li>- Resultats temps reel (Meilisearch + score photo)</li>
                  <li>- Export fiche comparateur et suivi conversion</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                Waitlist comparateur
              </p>
              <p className="text-sm text-muted-foreground">
                Restez informe du lancement et obtenez la demo interactive prioritaire du
                tableau comparatif.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link
                    href="https://wa.me/95606058?text=Je%20souhaite%20rejoindre%20la%20waitlist%20comparateur%20Auto%20Nexus%20BJ"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Rejoindre WhatsApp
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="mailto:product@autonexus.bj">Presenter a mon board</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
