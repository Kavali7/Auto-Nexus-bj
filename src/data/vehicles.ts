import { existsSync } from "fs";
import { join } from "path";

import { getPublicStorageUrl } from "@/lib/supabase/storage";

import type { Vehicle } from "./types";
import { vehicleDefinitions } from "./vehicle-definitions";

function resolveMediaPath(path: string): string {
  const sanitized = path.replace(/^\/+/, "");
  const target = sanitized.startsWith("vehicles/") ? sanitized : `vehicles/${sanitized}`;
  const hasExtension = /\.[a-z0-9]+$/i.test(target);
  const publicDir = join(process.cwd(), "public");

  if (hasExtension) {
    const webpTarget = target.replace(/\.[a-z0-9]+$/i, ".webp");
    const localWebpPath = join(publicDir, webpTarget);
    if (existsSync(localWebpPath)) {
      return `/${webpTarget}`;
    }
  }

  const localPath = join(publicDir, target);
  if (existsSync(localPath)) {
    return `/${target}`;
  }

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
