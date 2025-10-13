import { existsSync } from "fs";
import { join } from "path";

import { getPublicStorageUrl } from "@/lib/supabase/storage";

import type { Vehicle } from "./types";
import { vehicleDefinitions } from "./vehicle-definitions";

const fallbackVehicleImages = [
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518552718880-7b45efc951c3?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518552781802-5b4b0fc5f0c4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1449130015084-2d48a345ae35?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80",
];

function hashKey(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getFallbackImage(path: string): string {
  const index = hashKey(path) % fallbackVehicleImages.length;
  return fallbackVehicleImages[index];
}

const supabaseConfigured =
  Boolean(process.env.SUPABASE_URL) ||
  Boolean(process.env.SUPABASE_CDN_URL) ||
  Boolean(process.env.SUPABASE_CDN_HOSTNAME);

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

  if (!supabaseConfigured) {
    return getFallbackImage(target);
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
