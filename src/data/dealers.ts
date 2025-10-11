import { getPublicStorageUrl } from "@/lib/supabase/storage";

import type { Dealer } from "./types";
import { dealerDefinitions } from "./dealer-definitions";

function resolveDealerMedia(path: string): string {
  const clean = path.replace(/^\/+/, "");
  const target = clean.startsWith("dealers/") ? clean : `dealers/${clean}`;
  return getPublicStorageUrl(target);
}

export const dealers: Dealer[] = dealerDefinitions.map(
  ({ heroImagePath, galleryPaths, ...dealer }) => ({
    ...dealer,
    heroImage: resolveDealerMedia(heroImagePath),
    gallery: galleryPaths.map((path) => resolveDealerMedia(path)),
  }),
);

export function getDealers(): Dealer[] {
  return dealers;
}
