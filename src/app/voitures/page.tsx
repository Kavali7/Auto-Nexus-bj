import type { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dealers, type Dealer, vehicles } from "@/data";

export const metadata: Metadata = {
  title: "Voitures disponibles",
  description:
    "Listing statique Auto Nexus BJ : neufs & occasions premium, photos immersives, CTA WhatsApp en un clic.",
};

const dealerMap = new Map<string, Dealer>(dealers.map((d) => [d.id, d]));

const brandFilters = Array.from(
  new Set(vehicles.map((vehicle) => vehicle.brand)),
);

const cityFilters = Array.from(new Set(vehicles.map((vehicle) => vehicle.city)));

const fuelFilters = Array.from(
  new Set(vehicles.map((vehicle) => vehicle.fuel)),
);

export default function VehiclesPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="border-b border-border bg-white/80 py-12">
        <AnimatedSection className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6">
          <p className="text-xs uppercase tracking-[0.25em] text-brand">
            Marketplace Auto Nexus BJ
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Comparez nos véhicules premium
          </h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Sélection mockée : chaque annonce présente une galerie 12–20 photos,
            specs détaillées, et CTA WhatsApp/Appel dédiés concessionnaire. Les
            filtres dynamiques arrivent en phase 2 via Meilisearch.
          </p>
          <div className="flex flex-wrap gap-3 pt-4 text-sm font-medium text-muted-foreground">
            <span>Filtres en préparation :</span>
            <FilterBadges title="Marques" items={brandFilters} />
            <FilterBadges title="Villes" items={cityFilters} />
            <FilterBadges title="Énergie" items={fuelFilters} />
          </div>
        </AnimatedSection>
      </section>

      <section className="flex flex-1 bg-muted/20 py-12">
        <div className="mx-auto w-full max-w-6xl space-y-12 px-6">
          <AnimatedSection className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                dealer={dealerMap.get(vehicle.dealerId)}
              />
            ))}
          </AnimatedSection>

          <AnimatedSection
            delay={0.1}
            className="grid gap-8 rounded-3xl border border-border bg-white/90 p-8 shadow-md lg:grid-cols-[1.5fr_1fr]"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Comparateur & favoris arrivent ensuite
              </h2>
              <p className="text-base text-muted-foreground">
                Nous préparons l’ajout d’un sticky bar “Ajouter à comparer” + une
                page /comparer interactive. Objectif : alignement automatique
                quand un modèle existe chez plusieurs concessionnaires.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {vehicles
                  .filter((v) => v.brand === "Toyota" && v.model === "Hilux")
                  .map((v) => (
                    <Badge key={v.id} variant="outline">
                      {v.model} • {v.year} • {dealerMap.get(v.dealerId)?.city}
                    </Badge>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-brand">
                Phase 2
              </p>
              <p className="text-base text-muted-foreground">
                Rejoignez la waitlist comparateur et recevez la démo interactive
                dès que disponible.
              </p>
              <Button asChild>
                <Link
                  href="https://wa.me/22962459012?text=Je%20souhaite%20recevoir%20la%20d%C3%A9mo%20comparateur%20Auto%20Nexus%20BJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Inscription WhatsApp
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

interface FilterBadgesProps {
  title: string;
  items: string[];
}

function FilterBadges({ title, items }: FilterBadgesProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-muted/40 px-3 py-1">
      <span className="text-xs uppercase tracking-[0.18em] text-foreground/70">
        {title}
      </span>
      {items.slice(0, 4).map((item) => (
        <Badge key={item} variant="outline">
          {item}
        </Badge>
      ))}
      {items.length > 4 ? (
        <span className="text-xs text-muted-foreground">
          +{items.length - 4}
        </span>
      ) : null}
    </div>
  );
}
