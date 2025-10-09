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
import type { Dealer, Vehicle } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { buildWhatsappLink } from "@/lib/whatsapp";

interface VehicleCardProps {
  vehicle: Vehicle;
  dealer?: Dealer;
  whatsappNumber?: string;
}

export function VehicleCard({
  vehicle,
  dealer,
  whatsappNumber,
}: VehicleCardProps): JSX.Element {
  const contactNumber = whatsappNumber ?? dealer?.whatsapp;
  const whatsappHref = contactNumber
    ? buildWhatsappLink(
        contactNumber,
        `Bonjour Auto Nexus BJ 👋\nJe suis intéressé(e) par ${vehicle.brand} ${vehicle.model} (${vehicle.slug}).\nPouvez-vous me donner plus de détails ?`,
      )
    : undefined;

  const { addVehicle, removeVehicle, isSelected, canAddMore } = useCompare();
  const selected = isSelected(vehicle.id);

  const handleToggleCompare = () => {
    if (selected) {
      removeVehicle(vehicle.id);
    } else if (canAddMore) {
      addVehicle(vehicle.id);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/80 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="space-y-4 p-0">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={vehicle.heroImage}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-500 hover:scale-105"
            priority={vehicle.featured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
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
              <Badge className="bg-brand text-brand-foreground">
                Coup de cœur
              </Badge>
            ) : null}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <CardTitle className="text-2xl font-semibold leading-tight">
              {vehicle.brand} {vehicle.model}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-white/80">
              {vehicle.trim ? `${vehicle.trim} • ` : ""}
              {vehicle.fuel} • {vehicle.transmission} •{" "}
              {formatMileage(vehicle.mileage)} • {vehicle.city}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-lg font-semibold text-foreground">
          {formatPriceXof(vehicle.price)}
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          {vehicle.highlights.slice(0, 3).map((highlight) => (
            <p key={highlight} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
              <span>{highlight}</span>
            </p>
          ))}
        </div>
        {dealer ? (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {dealer.name} • {dealer.city}
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
          {selected ? "Retirer" : "Ajouter à comparer"}
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
