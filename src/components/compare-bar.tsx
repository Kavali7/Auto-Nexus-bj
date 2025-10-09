"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/components/compare-context";
import { formatPriceXof } from "@/lib/format";

export function CompareBar(): JSX.Element | null {
  const { selectedVehicles, removeVehicle, clear } = useCompare();

  if (selectedVehicles.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:px-0">
      <div className="pointer-events-auto flex w-full max-w-5xl flex-col gap-3 rounded-3xl border border-border bg-white/95 p-4 shadow-2xl backdrop-blur-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {selectedVehicles.length} véhicule
              {selectedVehicles.length > 1 ? "s" : ""} à comparer
            </Badge>
            <span className="text-sm text-muted-foreground">
              Ajoutez jusqu’à 4 annonces pour générer un tableau comparatif.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/comparer">Ouvrir le comparateur</Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={clear}>
              Vider
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {selectedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex min-w-[200px] flex-1 items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3"
            >
              <div className="relative h-12 w-16 overflow-hidden rounded-xl">
                <Image
                  src={vehicle.heroImage}
                  alt={vehicle.model}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {vehicle.year} • {formatPriceXof(vehicle.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeVehicle(vehicle.id)}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-brand"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
