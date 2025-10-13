import type { Dealer } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { dealers as seedDealers } from "@/data/dealers";
import type { Dealer as SeedDealer } from "@/data/types";
import { prisma } from "@/lib/prisma";
import { DEALERS_TAG } from "@/server/cache-tags";
import type { DealerSummary } from "@/types/catalog";

const logFallback = (context: string, error: unknown) => {
  console.warn(`[prisma:fallback] ${context}`, error);
};

const normalizeDealer = (dealer: Dealer): DealerSummary => ({
  id: dealer.id,
  name: dealer.name,
  slug: dealer.slug,
  city: dealer.city,
  phone: dealer.phone ?? null,
  whatsapp: dealer.whatsapp ?? null,
  email: dealer.email ?? null,
  headline: dealer.headline ?? null,
  description: dealer.description ?? null,
  foundedYear: dealer.foundedYear ?? null,
  staffCount: dealer.staffCount ?? null,
  rating: dealer.rating ?? null,
  ratingCount: dealer.ratingCount ?? null,
  logo: dealer.logo ?? null,
  address: dealer.address ?? null,
  specialties: dealer.specialties ?? [],
  website: dealer.website ?? null,
  instagram: dealer.instagram ?? null,
  facebook: dealer.facebook ?? null,
  linkedin: dealer.linkedin ?? null,
  inventorySize: dealer.inventorySize ?? null,
  heroImage: dealer.heroImage ?? null,
  gallery: dealer.gallery ?? [],
});

const seedDealerToSummary = (dealer: SeedDealer): DealerSummary => ({
  id: dealer.id,
  name: dealer.name,
  slug: dealer.slug,
  city: dealer.city,
  phone: dealer.phone ?? null,
  whatsapp: dealer.whatsapp ?? null,
  email: dealer.email ?? null,
  headline: dealer.headline ?? null,
  description: dealer.description ?? null,
  foundedYear: dealer.foundedYear ?? null,
  staffCount: dealer.staffCount ?? null,
  rating: dealer.rating ?? null,
  ratingCount: dealer.ratingCount ?? null,
  logo: dealer.logo ?? null,
  address: dealer.address ?? null,
  specialties: dealer.specialties ?? [],
  website: dealer.website ?? null,
  instagram: dealer.social?.instagram ?? null,
  facebook: dealer.social?.facebook ?? null,
  linkedin: dealer.social?.linkedin ?? null,
  inventorySize: dealer.inventorySize ?? null,
  heroImage: dealer.heroImage ?? null,
  gallery: dealer.gallery ?? [],
});

const seedDealerSummaries = seedDealers.map(seedDealerToSummary);
const seedDealersById = new Map(
  seedDealerSummaries.map((dealer) => [dealer.id, dealer] as const),
);
const seedDealersBySlug = new Map(
  seedDealerSummaries.map((dealer) => [dealer.slug, dealer] as const),
);

const cloneDealer = (dealer: DealerSummary): DealerSummary => ({
  ...dealer,
  specialties: [...dealer.specialties],
  gallery: [...dealer.gallery],
});

const useSeedDealers = (): DealerSummary[] => seedDealerSummaries.map(cloneDealer);

export const getDealers = unstable_cache(
  async () => {
    try {
      const dealers = await prisma.dealer.findMany({
        orderBy: {
          name: "asc",
        },
      });

      if (!dealers.length) {
        return useSeedDealers();
      }

      return dealers.map(normalizeDealer);
    } catch (error) {
      logFallback("fetch dealers", error);
      return useSeedDealers();
    }
  },
  ["dealers:all"],
  {
    tags: [DEALERS_TAG],
  },
);

export const getDealerById = unstable_cache(
  async (id: string) => {
    try {
      const dealer = await prisma.dealer.findUnique({
        where: { id },
      });

      if (dealer) {
        return normalizeDealer(dealer);
      }
    } catch (error) {
      logFallback(`fetch dealer by id (${id})`, error);
    }

    const fallback = seedDealersById.get(id);
    return fallback ? cloneDealer(fallback) : null;
  },
  ["dealers:by-id"],
  {
    tags: [DEALERS_TAG],
  },
);

export const getDealerBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const dealer = await prisma.dealer.findUnique({
        where: { slug },
      });

      if (dealer) {
        return normalizeDealer(dealer);
      }
    } catch (error) {
      logFallback(`fetch dealer by slug (${slug})`, error);
    }

    const fallback = seedDealersBySlug.get(slug);
    return fallback ? cloneDealer(fallback) : null;
  },
  ["dealers:by-slug"],
  {
    tags: [DEALERS_TAG],
  },
);
