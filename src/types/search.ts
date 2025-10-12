import type { VehicleSummary } from "@/types/catalog";

export type VehicleSearchFilters = {
  brand?: string;
  city?: string;
  fuel?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
};

export type VehicleSearchRequest = {
  query?: string;
  filters?: VehicleSearchFilters;
  limit?: number;
};

export type VehicleSearchSource = "meilisearch" | "database";

export type VehicleSearchFallbackReason =
  | "meilisearch-disabled"
  | "meilisearch-error"
  | "empty-index"
  | "missing-documents";

export type VehicleSearchResponse = {
  hits: VehicleSummary[];
  estimatedTotalHits: number;
  source: VehicleSearchSource;
  fallback: boolean;
  fallbackReason?: VehicleSearchFallbackReason;
};
