import { NextResponse } from "next/server";

import {
  getMeilisearchClient,
  VEHICLES_INDEX,
} from "@/lib/meilisearch/client";
import { getDealerById, getVehicles } from "@/data";
import { formatMileage, formatPriceXof } from "@/lib/format";

type SearchBody = {
  query?: string;
  filters?: {
    brand?: string;
    city?: string;
    fuel?: string;
    condition?: string;
  };
  limit?: number;
};

const vehiclesDataset = getVehicles();

export async function POST(request: Request) {
  const body = (await request.json()) as SearchBody;
  const client = getMeilisearchClient();

  if (client) {
    try {
      const index = client.index(VEHICLES_INDEX);
      const searchQuery = body.query ?? "";
      const filterClauses: string[] = [];

      if (body.filters?.brand && body.filters.brand !== "Toutes") {
        filterClauses.push(`brand = "${body.filters.brand}"`);
      }
      if (body.filters?.city && body.filters.city !== "Toutes") {
        filterClauses.push(`city = "${body.filters.city}"`);
      }
      if (body.filters?.fuel && body.filters.fuel !== "Tout") {
        filterClauses.push(`fuel = "${body.filters.fuel}"`);
      }
      if (body.filters?.condition && body.filters.condition !== "Toutes") {
        filterClauses.push(`condition = "${body.filters.condition}"`);
      }

      const searchResponse = await index.search(searchQuery, {
        filter: filterClauses,
        limit: body.limit ?? 24,
      });

      return NextResponse.json({
        hits: searchResponse.hits,
        estimatedTotalHits: searchResponse.estimatedTotalHits,
        source: "meilisearch",
      });
    } catch (error) {
      console.warn("Meilisearch search failed, falling back to local filter", error);
    }
  }

  const fallbackResults = fallbackFilter(body);

  return NextResponse.json({
    hits: fallbackResults,
    estimatedTotalHits: fallbackResults.length,
    source: "fallback",
  });
}

function fallbackFilter(body: SearchBody) {
  const normalizedQuery = (body.query ?? "").trim().toLowerCase();

  return vehiclesDataset
    .filter((vehicle) => {
      if (body.filters?.brand && body.filters.brand !== "Toutes") {
        if (vehicle.brand !== body.filters.brand) return false;
      }
      if (body.filters?.city && body.filters.city !== "Toutes") {
        if (vehicle.city !== body.filters.city) return false;
      }
      if (body.filters?.fuel && body.filters.fuel !== "Tout") {
        if (vehicle.fuel !== body.filters.fuel) return false;
      }
      if (body.filters?.condition && body.filters.condition !== "Toutes") {
        if (vehicle.condition !== body.filters.condition) return false;
      }

      if (!normalizedQuery) return true;

      const dealer = getDealerById(vehicle.dealerId);
      const haystack = [
        vehicle.brand,
        vehicle.model,
        vehicle.trim,
        vehicle.city,
        dealer?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .map((vehicle) => ({
      id: vehicle.id,
      slug: vehicle.slug,
      brand: vehicle.brand,
      model: vehicle.model,
      trim: vehicle.trim,
      city: vehicle.city,
      condition: vehicle.condition,
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      year: vehicle.year,
      price: vehicle.price,
      priceLabel: formatPriceXof(vehicle.price),
      mileage: vehicle.mileage,
      mileageLabel: formatMileage(vehicle.mileage),
      dealerId: vehicle.dealerId,
      dealerName: getDealerById(vehicle.dealerId)?.name ?? "",
      heroImage: vehicle.heroImage,
      highlights: vehicle.highlights,
      available: vehicle.available,
    }));
}
