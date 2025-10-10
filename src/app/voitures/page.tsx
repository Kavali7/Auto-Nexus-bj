import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { VehiclesExplorer } from "@/components/vehicles-explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDealers } from "@/server/dealers";
import { getVehicles } from "@/server/vehicles";

export const metadata: Metadata = {
  title: "Voitures disponibles",
  description:
    "Listing statique Auto Nexus BJ : filtres mock Meilisearch, cartes premium et comparateur prêt pour la phase 2.",
};

export default async function VehiclesPage(): Promise<JSX.Element> {
  const [vehicles, dealers] = await Promise.all([getVehicles(), getDealers()]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/5 to-transparent py-16">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">MVP Phase 1 — Listing statique</Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Explorez notre inventaire mock en temps réel
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Recherchez une marque, un modèle ou une ville et combinez les filtres
              pour simuler l’expérience Meilisearch. Chaque carte met en avant la
              galerie, les highlights et les CTA WhatsApp des concessionnaires.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Badge variant="outline">Mock Meilisearch</Badge>
              <Badge variant="outline">Comparateur intégré</Badge>
              <Badge variant="outline">Phase 2 ready</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/comparer">Ouvrir le comparateur</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link
                href="https://wa.me/95606058?text=Je%20souhaite%20planifier%20une%20d%C3%A9mo%20listing%20Auto%20Nexus%20BJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Planifier la démo
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      <section className="flex flex-1 bg-muted/15 py-16">
        <div className="mx-auto w-full max-w-6xl space-y-16 px-6">
          <VehiclesExplorer vehicles={vehicles} dealers={dealers} />

          <AnimatedSection
            delay={0.1}
            className="grid gap-8 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.5fr_1fr]"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Roadmap Phase 2 : live comparateur & favoris
              </h2>
              <p className="text-base text-muted-foreground">
                Cette base statique sera connectée à Meilisearch pour activer la
                recherche tolérante, les favoris personnalisés et le tableau de
                comparaison enrichi (PDF, partage, analytics).
              </p>
              <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.18em] text-brand">
                  Sprint à venir
                </p>
                <ul className="mt-2 space-y-1">
                  <li>• Sticky bar multi-compare + favoris persistants</li>
                  <li>• Résultats temps réel (Meilisearch + poids photo scoring)</li>
                  <li>• Export fiche comparateur + suivi conversion</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-brand">
                Waitlist comparateur
              </p>
              <p className="text-sm text-muted-foreground">
                Restez informé(e) du lancement et obtenez la démo interactive
                prioritaire du tableau comparatif.
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
                  <Link href="mailto:product@autonexus.bj">
                    Présenter à mon board
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
