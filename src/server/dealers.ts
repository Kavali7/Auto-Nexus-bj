import type { Dealer } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { DEALERS_TAG } from "@/server/cache-tags";
import type { DealerSummary } from "@/types/catalog";

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

export const getDealers = unstable_cache(
  async () => {
    const dealers = await prisma.dealer.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return dealers.map(normalizeDealer);
  },
  ["dealers:all"],
  {
    tags: [DEALERS_TAG],
  },
);

export const getDealerById = unstable_cache(
  async (id: string) => {
    const dealer = await prisma.dealer.findUnique({
      where: { id },
    });

    return dealer ? normalizeDealer(dealer) : null;
  },
  ["dealers:by-id"],
  {
    tags: [DEALERS_TAG],
  },
);

export const getDealerBySlug = unstable_cache(
  async (slug: string) => {
    const dealer = await prisma.dealer.findUnique({
      where: { slug },
    });

    return dealer ? normalizeDealer(dealer) : null;
  },
  ["dealers:by-slug"],
  {
    tags: [DEALERS_TAG],
  },
);
