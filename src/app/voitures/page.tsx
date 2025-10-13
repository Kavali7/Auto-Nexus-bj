import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleMasonry } from "@/components/vehicle-masonry";
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
    "Listing statique Auto Nexus BJ : filtres mock, comparateur et galerie photo immersive pour la demo.",
};

export default async function VehiclesPage(): Promise<JSX.Element> {
  const [vehicles, dealers] = await Promise.all([getVehicles(), getDealers()]);
  const galleryVehicles = vehicles.slice(0, 12);

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
      hint: "GMV de reference pour la demo",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-gradient-to-br from-white via-brand/10 to-transparent">
        <AnimatedSection className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16 lg:py-20">
          <div className="space-y-6">
            <Badge className="w-fit bg-brand/15 text-brand">Catalogue demo</Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Derniers arrivages mockes
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Choisissez un modele et lancez la comparaison instantanement. Cette page reste 100 pour 100 mockee pour assurer la stabilite hors connexion.
            </p>
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
                <Link href="#listing">Voir le listing complet</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/70 bg-white/95 shadow-sm">
                <CardContent className="space-y-1 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-foreground whitespace-nowrap">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground/80">{stat.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="border-b border-border bg-muted/10 py-12">
        <AnimatedSection className="mx-auto w-full max-w-6xl space-y-6 px-6">
          <h2 className="text-2xl font-semibold text-foreground">Coups d oeil rapides</h2>
          <VehicleMasonry
            items={galleryVehicles}
            dealers={dealers}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          />
        </AnimatedSection>
      </section>

      <section id="listing" className="flex flex-1 bg-muted/15 py-16">
        <div className="mx-auto w-full max-w-6xl space-y-12 px-6">
          <VehiclesExplorer vehicles={vehicles} dealers={dealers} />
        </div>
      </section>
    </div>
  );
}
