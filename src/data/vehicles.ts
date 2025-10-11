import { getPublicStorageUrl } from "@/lib/supabase/storage";

import type { Vehicle } from "./types";
import { vehicleDefinitions } from "./vehicle-definitions";

function resolveMediaPath(path: string): string {
  const sanitized = path.replace(/^\/+/, "");
  const target = sanitized.startsWith("vehicles/")
    ? sanitized
    : `vehicles/${sanitized}`;
  return getPublicStorageUrl(target);
}

export const vehicles: Vehicle[] = vehicleDefinitions.map(
  ({ heroImagePath, gallery, ...vehicle }) => ({
    ...vehicle,
    heroImage: resolveMediaPath(heroImagePath),
    gallery: gallery.map((item) => ({
      url: resolveMediaPath(item.file),
      label: item.label,
      kind: item.kind,
    })),
  }),
);

export function getVehicles(): Vehicle[] {
  return vehicles;
}
