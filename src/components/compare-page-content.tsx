"use client";

import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { CompareToggleButton } from "@/components/compare-toggle-button";
import { useCompare } from "@/components/compare-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDealerById } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";

const comparisonFields: {
  label: string;
  accessor: (vehicle: ReturnType<typeof mapVehicleForCompare>) => string;
}[] = [
  { label: "Prix", accessor: (v) => formatPriceXof(v.price) },
  { label: "Statut", accessor: (v) => `${v.condition} • ${v.year}` },
  { label: "Kilométrage", accessor: (v) => formatMileage(v.mileage) },
  { label: "Énergie / Boîte", accessor: (v) => `${v.fuel} • ${v.transmission}` },
  { label: "Ville", accessor: (v) => v.city },
  { label: "Concessionnaire", accessor: (v) => v.dealerName },
];

export function ComparePageContent(): JSX.Element {
  const { selectedVehicles, clear } = useCompare();
  const entries = selectedVehicles.map(mapVehicleForCompare);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-white/80 py-16">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge variant="secondary">
              Comparateur • {selectedVehicles.length} sélectionné(s)
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Comparez vos véhicules coups de cœur
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              Cette vue statique illustre la future expérience Meilisearch : ajouter
              des véhicules depuis le listing ou les fiches et retrouvez-les ici
              pour un tableau comparatif détaillé.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="outline">
              <Link href="/voitures">Retour au listing</Link>
            </Button>
            <Button onClick={clear} size="lg" variant="ghost">
              Vider la sélection
            </Button>
          </div>
        </AnimatedSection>
      </section>

      <main className="flex flex-1 flex-col bg-muted/10 py-16">
        <AnimatedSection className="mx-auto w-full max-w-6xl px-6">
          {entries.length === 0 ? (
            <Card className="border-border/70 bg-white/95 shadow-sm">
              <CardHeader>
                <CardTitle>Aucun véhicule sélectionné</CardTitle>
                <CardDescription>
                  Ajoutez des véhicules via le bouton “Ajouter à comparer” sur les
                  listings ou fiches pour visualiser le tableau comparatif.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/voitures">Explorer les annonces</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-10">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {entries.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="border-border/70 bg-white/95 shadow-sm"
                  >
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-lg text-foreground">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <CardDescription>
                        {vehicle.trim} • {vehicle.condition} • {vehicle.year}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div className="rounded-xl border border-dashed border-brand/30 bg-brand/5 p-3">
                        <p className="text-xs uppercase tracking-[0.18em] text-brand">
                          Prix estimé
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatPriceXof(vehicle.price)}
                        </p>
                      </div>
                      <p>
                        Kilométrage :{" "}
                        <span className="font-medium text-foreground">
                          {formatMileage(vehicle.mileage)}
                        </span>
                      </p>
                      <p>
                        Concessionnaire :{" "}
                        <span className="font-medium text-foreground">
                          {vehicle.dealerName}
                        </span>
                      </p>
                      <CompareToggleButton
                        vehicleId={vehicle.id}
                        size="sm"
                      >
                        Retirer du comparateur
                      </CompareToggleButton>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-border/70 bg-white/95 shadow-sm">
                <CardHeader>
                  <CardTitle>Tableau comparatif</CardTitle>
                  <CardDescription>
                    Aperçu de la grille Phase 2 : colonnes dynamiques, filtres,
                    export PDF et stickiness sur desktop.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <div className="min-w-[640px]">
                    <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(160px,1fr))] gap-2 border-b border-border pb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span>Spécifications</span>
                      {entries.map((vehicle) => (
                        <span key={vehicle.id} className="text-center">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-4 pt-4 text-sm text-muted-foreground">
                      {comparisonFields.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[160px_repeat(auto-fit,minmax(160px,1fr))] gap-2"
                        >
                          <span className="font-medium text-foreground">
                            {row.label}
                          </span>
                          {entries.map((vehicle) => (
                            <span key={`${vehicle.id}-${row.label}`} className="text-center">
                              {row.accessor(vehicle)}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </AnimatedSection>
      </main>
    </div>
  );
}

function mapVehicleForCompare(vehicle: ReturnType<typeof useCompare>["selectedVehicles"][number]) {
  const dealer = getDealerById(vehicle.dealerId);

  return {
    id: vehicle.id,
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
    dealerName: dealer?.name ?? "—",
  };
}
