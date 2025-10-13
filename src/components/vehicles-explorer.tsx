"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DealerSummary, VehicleSummary } from "@/types/catalog";
import type {
  VehicleSearchFallbackReason,
  VehicleSearchRequest,
  VehicleSearchResponse,
} from "@/types/search";

type FuelFilter = VehicleSummary["fuel"] | "Tout";
type ConditionFilter = VehicleSummary["condition"] | "Toutes";

type VehiclesExplorerProps = {
  vehicles: VehicleSummary[];
  dealers: DealerSummary[];
};

const pageSize = 12;

const priceFilters = [
  { value: "all", label: "Tous les prix" },
  { value: "under-10m", label: "Moins de 10M XOF", max: 10_000_000 },
  { value: "10-20m", label: "10M a 20M XOF", min: 10_000_000, max: 20_000_000 },
  { value: "20-40m", label: "20M a 40M XOF", min: 20_000_000, max: 40_000_000 },
  { value: "40-60m", label: "40M a 60M XOF", min: 40_000_000, max: 60_000_000 },
  { value: "above-60m", label: "Plus de 60M XOF", min: 60_000_000 },
] as const;

type PriceFilterValue = (typeof priceFilters)[number]["value"];

const priceFilterMap: Record<PriceFilterValue, { min?: number; max?: number }> =
  priceFilters.reduce(
    (acc, filter) => {
      const entry: { min?: number; max?: number } = {};
      if ("min" in filter) {
        entry.min = filter.min;
      }
      if ("max" in filter) {
        entry.max = filter.max;
      }
      acc[filter.value] = entry;
      return acc;
    },
    {} as Record<PriceFilterValue, { min?: number; max?: number }>,
  );

const fallbackReasonLabel: Record<VehicleSearchFallbackReason, string> = {
  "meilisearch-disabled": "Index inactif",
  "meilisearch-error": "Erreur Meilisearch",
  "empty-index": "Index vide",
  "missing-documents": "Documents manquants",
};

type FilterState = {
  query: string;
  brand: string;
  city: string;
  fuel: string;
  condition: string;
  priceRange: PriceFilterValue;
};

function applyFiltersToVehicles(
  vehicles: VehicleSummary[],
  filters: FilterState,
): VehicleSummary[] {
  const tokens = filters.query.toLowerCase().split(/\s+/).filter(Boolean);

  const priceConfig = priceFilterMap[filters.priceRange];

  return vehicles.filter((vehicle) => {
    if (filters.brand !== "Toutes" && vehicle.brand !== filters.brand) {
      return false;
    }
    if (filters.city !== "Toutes" && vehicle.city !== filters.city) {
      return false;
    }
    if (filters.fuel !== "Tout" && vehicle.fuel !== filters.fuel) {
      return false;
    }
    if (filters.condition !== "Toutes" && vehicle.condition !== filters.condition) {
      return false;
    }
    if (priceConfig?.min !== undefined && vehicle.price < priceConfig.min) {
      return false;
    }
    if (priceConfig?.max !== undefined && vehicle.price > priceConfig.max) {
      return false;
    }

    if (tokens.length > 0) {
      const haystack = [
        vehicle.brand,
        vehicle.model,
        vehicle.city,
        String(vehicle.year ?? ""),
        vehicle.transmission ?? "",
        vehicle.fuel ?? "",
      ]
        .join(" ")
        .toLowerCase();

      if (!tokens.every((token) => haystack.includes(token))) {
        return false;
      }
    }

    return true;
  });
}

async function searchFetcher([
  ,
  query,
  brandFilter,
  cityFilter,
  fuelFilter,
  conditionFilter,
  priceFilter,
  limitValue,
]: readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  PriceFilterValue,
  string,
]): Promise<VehicleSearchResponse> {
  const filters: VehicleSearchRequest["filters"] = {};

  if (brandFilter && brandFilter !== "Toutes") {
    filters.brand = brandFilter;
  }
  if (cityFilter && cityFilter !== "Toutes") {
    filters.city = cityFilter;
  }
  if (fuelFilter && fuelFilter !== "Tout") {
    filters.fuel = fuelFilter;
  }
  if (conditionFilter && conditionFilter !== "Toutes") {
    filters.condition = conditionFilter;
  }
  const priceConfig = priceFilterMap[priceFilter];
  if (priceConfig?.min !== undefined) {
    filters.priceMin = priceConfig.min;
  }
  if (priceConfig?.max !== undefined) {
    filters.priceMax = priceConfig.max;
  }

  const parsedLimit = Number.parseInt(limitValue, 10);
  const payload: VehicleSearchRequest = {};

  if (query) {
    payload.query = query;
  }
  if (Object.keys(filters).length > 0) {
    payload.filters = filters;
  }
  if (!Number.isNaN(parsedLimit)) {
    payload.limit = parsedLimit;
  }

  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return (await response.json()) as VehicleSearchResponse;
}

export function VehiclesExplorer({
  vehicles,
  dealers,
}: VehiclesExplorerProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [brand, setBrand] = useState("Toutes");
  const [city, setCity] = useState("Toutes");
  const [fuel, setFuel] = useState<FuelFilter>("Tout");
  const [condition, setCondition] = useState<ConditionFilter>("Toutes");
  const [priceRange, setPriceRange] = useState<PriceFilterValue>("all");
  const [resultLimit, setResultLimit] = useState(pageSize);
  const [forceMockMode, setForceMockMode] = useState(false);
  const [fallbackReasonState, setFallbackReasonState] = useState<
    VehicleSearchFallbackReason | undefined
  >(undefined);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setResultLimit(pageSize);
  }, [debouncedSearch, brand, city, fuel, condition, priceRange]);

  const dealersMap = useMemo(
    () => new Map(dealers.map((dealer) => [dealer.id, dealer] as const)),
    [dealers],
  );

  const filteredMockResults = useMemo(
    () =>
      applyFiltersToVehicles(vehicles, {
        query: debouncedSearch,
        brand,
        city,
        fuel,
        condition,
        priceRange,
      }),
    [vehicles, debouncedSearch, brand, city, fuel, condition, priceRange],
  );

  const hasUserFilters =
    debouncedSearch.trim().length > 0 ||
    brand !== "Toutes" ||
    city !== "Toutes" ||
    fuel !== "Tout" ||
    condition !== "Toutes" ||
    priceRange !== "all";

  const shouldUseRemote = hasUserFilters && !forceMockMode;

  const initialResponse = useMemo<VehicleSearchResponse>(
    () => ({
      hits: filteredMockResults,
      estimatedTotalHits: filteredMockResults.length,
      source: "database",
      fallback: forceMockMode || (hasUserFilters && !shouldUseRemote),
      fallbackReason:
        forceMockMode || (hasUserFilters && !shouldUseRemote)
          ? fallbackReasonState
          : undefined,
    }),
    [
      filteredMockResults,
      hasUserFilters,
      shouldUseRemote,
      forceMockMode,
      fallbackReasonState,
    ],
  );

  const swrKey = useMemo(
    () =>
      !shouldUseRemote
        ? null
        : ([
            "vehicles-search",
            debouncedSearch,
            brand,
            city,
            fuel,
            condition,
            priceRange,
            resultLimit.toString(),
          ] as const),
    [
      shouldUseRemote,
      debouncedSearch,
      brand,
      city,
      fuel,
      condition,
      priceRange,
      resultLimit,
    ],
  );

  const handleSearch = useCallback(
    async (
      key: readonly [
        string,
        string,
        string,
        string,
        string,
        string,
        PriceFilterValue,
        string,
      ],
    ): Promise<VehicleSearchResponse> => {
      const [
        ,
        queryValue,
        brandValue,
        cityValue,
        fuelValue,
        conditionValue,
        priceValue,
        limitValue,
      ] = key;

      try {
        const response = await searchFetcher(key);

        if (response.fallback) {
          setFallbackReasonState(response.fallbackReason ?? "meilisearch-error");
          setForceMockMode(true);
        } else {
          setFallbackReasonState(undefined);
        }

        return response;
      } catch (error) {
        console.error("Vehicle search failed", error);
        setFallbackReasonState("meilisearch-error");
        setForceMockMode(true);

        const fallbackHits = applyFiltersToVehicles(vehicles, {
          query: queryValue,
          brand: brandValue,
          city: cityValue,
          fuel: fuelValue,
          condition: conditionValue,
          priceRange: priceValue,
        });

        const parsedLimit = Number.parseInt(limitValue, 10);
        const limitedHits = Number.isNaN(parsedLimit)
          ? fallbackHits
          : fallbackHits.slice(0, parsedLimit);

        return {
          hits: limitedHits,
          estimatedTotalHits: fallbackHits.length,
          source: "database",
          fallback: true,
          fallbackReason: "meilisearch-error",
        };
      }
    },
    [vehicles],
  );

  const {
    data: remoteData,
    isLoading,
    isValidating,
  } = useSWR<VehicleSearchResponse>(swrKey, handleSearch, {
    fallbackData: initialResponse,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    shouldRetryOnError: false,
  });

  const usingRemoteData =
    Boolean(remoteData) && shouldUseRemote && !remoteData?.fallback && !forceMockMode;

  const results = usingRemoteData ? remoteData!.hits : filteredMockResults;

  const totalResults = usingRemoteData
    ? (remoteData!.estimatedTotalHits ?? remoteData!.hits.length)
    : filteredMockResults.length;

  const visibleResults = results.slice(0, resultLimit);

  const fallbackActive =
    !usingRemoteData && (forceMockMode || (shouldUseRemote && hasUserFilters));

  const fallbackReason = fallbackActive
    ? (fallbackReasonState ?? remoteData?.fallbackReason)
    : undefined;

  const resultMeta: VehicleSearchResponse = usingRemoteData
    ? remoteData!
    : {
        hits: results,
        estimatedTotalHits: totalResults,
        source: "database",
        fallback: fallbackActive,
        fallbackReason,
      };

  const isSearching = shouldUseRemote ? isLoading || isValidating : false;
  const fallbackLabel = fallbackReason ? fallbackReasonLabel[fallbackReason] : undefined;

  const brandOptions = useMemo(() => {
    const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand))).sort(
      (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    return ["Toutes", ...brands];
  }, [vehicles]);

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(vehicles.map((vehicle) => vehicle.city))).sort(
      (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    return ["Toutes", ...cities];
  }, [vehicles]);

  const fuelOptions = useMemo(() => {
    const fuels = Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel))).sort(
      (a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    return ["Tout", ...fuels];
  }, [vehicles]);
  const conditionOptions: ConditionFilter[] = ["Toutes", "Neuf", "Occasion"];
  const priceOptions = useMemo(
    () =>
      priceFilters.map((filter) => ({
        value: filter.value,
        label: filter.label,
      })),
    [],
  );

  const compareSuggestions = useMemo(() => {
    const groups = vehicles.reduce<Record<string, VehicleSummary[]>>(
      (accumulator, vehicle) => {
        const key = `${vehicle.brand}-${vehicle.model}`.toLowerCase();
        if (!accumulator[key]) {
          accumulator[key] = [];
        }
        accumulator[key].push(vehicle);
        return accumulator;
      },
      {},
    );

    return Object.values(groups)
      .filter((group) => group.length > 1)
      .slice(0, 4);
  }, [vehicles]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setBrand("Toutes");
    setCity("Toutes");
    setFuel("Tout");
    setCondition("Toutes");
    setPriceRange("all");
    setResultLimit(pageSize);
  };

  return (
    <div className="space-y-12">
      <AnimatedSection>
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-white/95 p-8 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="w-fit">
                Recherche live (mock)
              </Badge>
              <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Filtrez par marque, ville, energie et budget
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Cette vue simule Meilisearch : combinaisons multi-filtres, tri et
                suggestions pour alimenter le comparateur.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span>Hits trouves : {resultMeta.estimatedTotalHits}</span>
              <span>
                Source :{" "}
                {resultMeta.source === "meilisearch" ? "Meilisearch" : "Base de donnees"}
                {resultMeta.fallback ? " (fallback)" : ""}
              </span>
              {resultMeta.fallbackReason ? (
                <span>Raison : {fallbackReasonLabel[resultMeta.fallbackReason]}</span>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]">
            <div className="md:col-span-2">
              <Input
                placeholder="Rechercher une marque, un modele, une ville..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <FilterSelect
              label="Marque"
              value={brand}
              options={brandOptions}
              onChange={setBrand}
            />
            <FilterSelect
              label="Ville"
              value={city}
              options={cityOptions}
              onChange={setCity}
            />
            <FilterSelect
              label="Carburant"
              value={fuel}
              options={fuelOptions}
              onChange={(value) => setFuel(value as FuelFilter)}
            />
            <FilterSelect
              label="Condition"
              value={condition}
              options={conditionOptions}
              onChange={(value) => setCondition(value as ConditionFilter)}
            />
            <FilterSelect
              label="Budget"
              value={priceRange}
              options={priceOptions}
              onChange={(value) => setPriceRange(value as PriceFilterValue)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Badge variant="outline">
              {isSearching
                ? "Recherche en cours..."
                : `${visibleResults.length} / ${totalResults} resultats`}
            </Badge>
            {fallbackActive ? (
              <span className="text-xs text-amber-600">
                Mode fallback actif{fallbackLabel ? ` - ${fallbackLabel}` : ""}
              </span>
            ) : null}
            {search ||
            brand !== "Toutes" ||
            city !== "Toutes" ||
            fuel !== "Tout" ||
            condition !== "Toutes" ||
            priceRange !== "all" ? (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reinitialiser
              </Button>
            ) : null}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">
            Suggestion comparateur
          </p>
          <p className="text-sm text-muted-foreground">
            Ces modeles ont plusieurs offres - parfait pour la demo comparateur.
            Ajoutez-les via &quot;Ajouter au comparer&quot; pour les visualiser dans
            /comparer.
          </p>
          <div className="space-y-2">
            {compareSuggestions.map((group) => (
              <div
                key={`${group[0].brand}-${group[0].model}`}
                className="rounded-lg border border-border bg-white/80 p-3 text-xs text-muted-foreground"
              >
                <p className="font-semibold text-foreground">
                  {group[0].brand} {group[0].model}
                </p>
                <p>
                  {group.length} annonces (
                  {group.map((vehicle) => vehicle.city).join(", ")})
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        {visibleResults.length === 0 ? (
          <CardEmptyState search={search} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleResults.map((vehicle) => {
              const dealer = dealersMap.get(vehicle.dealerId);
              return <VehicleCard key={vehicle.id} vehicle={vehicle} dealer={dealer} />;
            })}
          </div>
        )}
      </AnimatedSection>
      {visibleResults.length > 0 && visibleResults.length < totalResults ? (
        <AnimatedSection delay={0.1}>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setResultLimit((previous) => previous + pageSize)}
            >
              Charger plus d annonces
            </Button>
          </div>
        </AnimatedSection>
      ) : null}
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: (string | { value: string; label: string })[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps): JSX.Element {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {label}
      <select
        className="h-11 rounded-md border border-border bg-white px-3 text-sm font-medium text-foreground shadow-sm transition focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CardEmptyState({ search }: { search: string }): JSX.Element {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white/95 p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Aucun resultat</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        {search
          ? "Essayez un autre mot cle ou reinitialisez les filtres pour afficher tout le catalogue."
          : "Ajustez les filtres pour explorer d'autres combinaisons du catalogue."}
      </p>
      <div className="mt-6 flex justify-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Badge variant="secondary">Temps reel</Badge>
        <Badge variant="secondary">Catalogue interactif</Badge>
      </div>
    </div>
  );
}
