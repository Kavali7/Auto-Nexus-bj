"use client";

import Image from "next/image";
import Link from "next/link";

import { useCompare } from "@/components/compare-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";
import {
  DEFAULT_VEHICLE_BLUR_DATA_URL,
  getVehicleBlurDataUrl,
} from "@/lib/vehicle-images";
import { useDemoNotice } from "@/hooks/use-demo-notice";
import type { DealerSummary, VehicleSummary } from "@/types/catalog";
import type { Dealer as SeedDealer, Vehicle as SeedVehicle } from "@/data";

type VehicleCardProps = {
  vehicle: VehicleSummary | SeedVehicle;
  dealer?: DealerSummary | SeedDealer;
  whatsappNumber?: string;
};

function hasFinancingOption(highlights: string[]): boolean {
  return highlights.some((highlight) => highlight.toLowerCase().includes("financement"));
}

function resolvePromoHighlight(vehicle: VehicleSummary | SeedVehicle): string {
  const match =
    vehicle.highlights.find((highlight) =>
      /(pack|bonus|offre|edition|lancement|promo|detailing|premium)/i.test(
        highlight.toLowerCase(),
      ),
    ) ?? null;

  if (match) {
    return match;
  }

  if (!vehicle.available) {
    return "Bientot disponible";
  }

  if (vehicle.featured) {
    return "Edition lancement";
  }

  return "Demo marketplace";
}

export function VehicleCard({
  vehicle,
  dealer,
  whatsappNumber,
}: VehicleCardProps): JSX.Element {
  const contactNumber = whatsappNumber ?? dealer?.whatsapp ?? undefined;
  const whatsappHref = contactNumber
    ? buildWhatsappLink(
        contactNumber,
        `Bonjour Auto Nexus BJ,\nJe suis interesse(e) par ${vehicle.brand} ${vehicle.model} (${vehicle.slug}).\nPouvez-vous partager plus de details ?`,
      )
    : undefined;

  const { addVehicle, removeVehicle, isSelected, canAddMore } = useCompare();
  const notifyDemo = useDemoNotice();
  const selected = isSelected(vehicle.id);

  const heroBlurDataURL = getVehicleBlurDataUrl(
    vehicle.heroImage,
    DEFAULT_VEHICLE_BLUR_DATA_URL,
  );

  const handleToggleCompare = () => {
    if (selected) {
      removeVehicle(vehicle.id);
      return;
    }

    if (!canAddMore) {
      return;
    }

    notifyDemo("favorites");
    addVehicle(vehicle.id);
  };

  const financingEnabled = hasFinancingOption(vehicle.highlights);
  const promoLabel = resolvePromoHighlight(vehicle);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/80 bg-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardHeader className="space-y-4 p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={vehicle.heroImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            priority={vehicle.featured}
            placeholder="blur"
            blurDataURL={heroBlurDataURL}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/40" />
          <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={vehicle.condition === "Neuf" ? "default" : "secondary"}
                className="bg-white/90 text-foreground backdrop-blur"
              >
                {vehicle.condition}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/60 bg-black/50 text-white backdrop-blur"
              >
                {vehicle.year}
              </Badge>
              {vehicle.featured ? (
                <Badge className="bg-brand text-brand-foreground">Coup de coeur</Badge>
              ) : null}
            </div>
            <Badge className="bg-black/60 text-white backdrop-blur">{promoLabel}</Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <CardTitle className="text-2xl font-semibold leading-tight">
              {vehicle.brand} {vehicle.model}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-white/80">
              {vehicle.trim ? `${vehicle.trim} - ` : ""}
              {vehicle.fuel} - {vehicle.transmission} - {formatMileage(vehicle.mileage)} -{" "}
              {vehicle.city}
            </CardDescription>
          </div>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              Visualiser la fiche
            </p>
            <Button asChild size="sm" variant="secondary" className="pointer-events-auto">
              <Link href={`/voitures/${vehicle.slug}`}>Ouvrir</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-foreground">
            {formatPriceXof(vehicle.price)}
          </p>
          {financingEnabled ? (
            <Badge className="border-brand/30 bg-brand/10 text-brand">
              Financement dispo
            </Badge>
          ) : null}
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          {vehicle.highlights.slice(0, 2).map((highlight) => (
            <p key={highlight} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
              <span>{highlight}</span>
            </p>
          ))}
        </div>
        {dealer ? (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {dealer.name} - {dealer.city}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 border-t border-border/70 bg-muted/30 p-4">
        <Button
          size="sm"
          variant={selected ? "secondary" : "ghost"}
          onClick={handleToggleCompare}
          disabled={!selected && !canAddMore}
        >
          {selected ? "Retirer" : "Ajouter au comparer"}
        </Button>
        <Button asChild size="sm">
          <Link href={`/voitures/${vehicle.slug}`}>Voir la fiche</Link>
        </Button>
        {whatsappHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
