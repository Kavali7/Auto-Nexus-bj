import type { MetadataRoute } from "next";

import { getDealers } from "@/server/dealers";
import { getVehicleSlugs } from "@/server/vehicles";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://autonexus.bj";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicleSlugs, dealers] = await Promise.all([getVehicleSlugs(), getDealers()]);

  const now = new Date();

  const staticRoutes = [
    "/",
    "/voitures",
    "/concessionnaires",
    "/services",
    "/dashboard",
    "/investisseurs",
    "/comparer",
    "/mentions-legales",
    "/politique-confidentialite",
    "/conditions-generales",
  ];

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const vehicleEntries = vehicleSlugs.map((slug) => ({
    url: `${siteUrl}/voitures/${slug}`,
    lastModified: now,
  }));

  const dealerEntries = dealers.map((dealer) => ({
    url: `${siteUrl}/concessionnaires/${dealer.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...vehicleEntries, ...dealerEntries];
}
