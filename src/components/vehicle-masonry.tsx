import Image from "next/image";
import Link from "next/link";

import { dealers, getFeaturedVehicles, type Vehicle } from "@/data";
import { Badge } from "@/components/ui/badge";
import { formatMileage, formatPriceXof } from "@/lib/format";
import { cn } from "@/lib/utils";

const dealerById = new Map(dealers.map((dealer) => [dealer.id, dealer]));

interface VehicleMasonryProps {
  items?: Vehicle[];
  className?: string;
}

export function VehicleMasonry({
  items,
  className,
}: VehicleMasonryProps): JSX.Element {
  const vehicles = items ?? getFeaturedVehicles();

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {vehicles.map((vehicle) => {
        const dealer = dealerById.get(vehicle.dealerId);

        return (
          <article
            key={vehicle.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link href={`/voitures/${vehicle.slug}`} className="group flex h-full flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={vehicle.condition === "Neuf" ? "default" : "secondary"}
                    className="bg-white/90 text-foreground backdrop-blur"
                  >
                    {vehicle.condition}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/60 bg-black/40 text-white backdrop-blur"
                  >
                    {vehicle.year}
                  </Badge>
                  {vehicle.featured ? (
                    <Badge className="bg-brand text-brand-foreground">
                      Coup de cœur
                    </Badge>
                  ) : null}
                </div>
                <Image
                  src={vehicle.heroImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={900}
                  height={600}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-3 text-white">
                  <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-white/80">
                    <span>{vehicle.brand}</span>
                    <span>{vehicle.city}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold leading-tight">
                      {vehicle.model} {vehicle.trim ? `• ${vehicle.trim}` : ""}
                    </h3>
                    <p className="text-sm text-white/80">
                      {vehicle.fuel} • {vehicle.transmission} •{" "}
                      {formatMileage(vehicle.mileage)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 border-t border-border p-5 text-sm text-muted-foreground">
                <div className="flex items-center justify-between text-foreground">
                  <span className="text-lg font-semibold">
                    {formatPriceXof(vehicle.price)}
                  </span>
                  {dealer ? (
                    <span className="text-xs uppercase tracking-[0.18em]">
                      {dealer.name}
                    </span>
                  ) : null}
                </div>
                <ul className="grid gap-2 text-xs text-muted-foreground">
                  {vehicle.highlights.slice(0, 3).map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
