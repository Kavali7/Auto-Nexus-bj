import { NextResponse } from "next/server";

import {
  getMeilisearchClient,
  VEHICLES_INDEX,
} from "@/lib/meilisearch/client";
import { getDealers } from "@/server/dealers";
import { getVehicleSummariesByIds, getVehicles } from "@/server/vehicles";
import type { VehicleSummary } from "@/types/catalog";
import type {
  VehicleSearchRequest,
  VehicleSearchResponse,
} from "@/types/search";

export async function POST(request: Request) {
  const body = (await request.json()) as VehicleSearchRequest;
  const client = getMeilisearchClient();
  const limit = body.limit ?? 24;

  if (client) {
    try {
      const index = client.index(VEHICLES_INDEX);
      const searchQuery = (body.query ?? "").trim();
      const filterClauses = buildFilterClauses(body);

      const searchResponse = await index.search(searchQuery, {
        filter: filterClauses.length > 0 ? filterClauses : undefined,
        limit,
      });

      const hitIds = searchResponse.hits
        .map((hit) => {
          if (typeof hit === "object" && hit !== null && "id" in hit) {
            const value = (hit as Record<string, unknown>).id;
            return typeof value === "string" ? value : null;
          }
          return null;
        })
        .filter((id): id is string => Boolean(id));

      if (hitIds.length > 0) {
        const vehicles = await getVehicleSummariesByIds(hitIds);
        const vehiclesById = new Map(
          vehicles.map((vehicle) => [vehicle.id, vehicle] as const),
        );

        const orderedHits = hitIds
          .map((id) => vehiclesById.get(id))
          .filter((vehicle): vehicle is VehicleSummary => Boolean(vehicle));

        if (orderedHits.length > 0) {
          return NextResponse.json({
            hits: orderedHits,
            estimatedTotalHits:
              searchResponse.estimatedTotalHits ?? orderedHits.length,
            source: "meilisearch",
            fallback: false,
          } satisfies VehicleSearchResponse);
        }
      }

      const fallbackResults = await fallbackFilter(body, limit);

      return NextResponse.json({
        hits: fallbackResults.hits,
        estimatedTotalHits: fallbackResults.total,
        source: "database",
        fallback: true,
        fallbackReason: hitIds.length === 0 ? "empty-index" : "missing-documents",
      } satisfies VehicleSearchResponse);
    } catch (error) {
      console.warn(
        "Meilisearch search failed, falling back to database filter",
        error,
      );
    }
  }

  const fallbackResults = await fallbackFilter(body, limit);

  return NextResponse.json({
    hits: fallbackResults.hits,
    estimatedTotalHits: fallbackResults.total,
    source: "database",
    fallback: true,
    fallbackReason: client ? "meilisearch-error" : "meilisearch-disabled",
  } satisfies VehicleSearchResponse);
}

function buildFilterClauses(body: VehicleSearchRequest): string[] {
  const clauses: string[] = [];

  if (body.filters?.brand && body.filters.brand !== "Toutes") {
    clauses.push(`brand = "${body.filters.brand}"`);
  }
  if (body.filters?.city && body.filters.city !== "Toutes") {
    clauses.push(`city = "${body.filters.city}"`);
  }
  if (body.filters?.fuel && body.filters.fuel !== "Tout") {
    clauses.push(`fuel = "${body.filters.fuel}"`);
  }
  if (body.filters?.condition && body.filters.condition !== "Toutes") {
    clauses.push(`condition = "${body.filters.condition}"`);
  }
  if (typeof body.filters?.priceMin === "number") {
    clauses.push(`price >= ${body.filters.priceMin}`);
  }
  if (typeof body.filters?.priceMax === "number") {
    clauses.push(`price <= ${body.filters.priceMax}`);
  }

  return clauses;
}

async function fallbackFilter(body: VehicleSearchRequest, limit: number) {
  const normalizedQuery = (body.query ?? "").trim().toLowerCase();
  const [vehicles, dealers] = await Promise.all([getVehicles(), getDealers()]);
  const dealerMap = new Map(
    dealers.map((dealer) => [dealer.id, dealer] as const),
  );

  const filtered = vehicles.filter((vehicle) => {
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
    if (typeof body.filters?.priceMin === "number") {
      if (vehicle.price < body.filters.priceMin) return false;
    }
    if (typeof body.filters?.priceMax === "number") {
      if (vehicle.price > body.filters.priceMax) return false;
    }

    if (!normalizedQuery) return true;

    const dealer = dealerMap.get(vehicle.dealerId);
    const haystack = [
      vehicle.brand,
      vehicle.model,
      vehicle.trim ?? "",
      vehicle.city,
      dealer?.name ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return {
    hits: filtered.slice(0, limit),
    total: filtered.length,
  };
}
