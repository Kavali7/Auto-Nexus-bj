"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimatedSection } from "@/components/animated-section";
import { VehicleCard } from "@/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dealers, vehicles, type Vehicle } from "@/data";

type FuelFilter = Vehicle["fuel"] | "Tout";
type ConditionFilter = Vehicle["condition"] | "Toutes";

type SearchFilters = {
  brand: string;
  city: string;
  fuel: FuelFilter;
  condition: ConditionFilter;
};

type SearchResponse = {
  hits: Array<{
    id: string;
    dealerId: string;
  }>;
  estimatedTotalHits: number;
  source: "meilisearch" | "fallback";
};

const VEHICLE_BY_ID = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

export function VehiclesExplorer(): JSX.Element {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Toutes");
  const [city, setCity] = useState("Toutes");
  const [fuel, setFuel] = useState<FuelFilter>("Tout");
  const [condition, setCondition] = useState<ConditionFilter>("Toutes");
  const [results, setResults] = useState<Vehicle[]>(vehicles);
  const [resultMeta, setResultMeta] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const brandOptions = useMemo(
    () => ["Toutes", ...new Set(vehicles.map((vehicle) => vehicle.brand))],
    [],
  );
  const cityOptions = useMemo(
    () => ["Toutes", ...new Set(vehicles.map((vehicle) => vehicle.city))],
    [],
  );
  const fuelOptions = useMemo(
    () => ["Tout", ...new Set(vehicles.map((vehicle) => vehicle.fuel))],
    [],
  );
  const conditionOptions: ConditionFilter[] = ["Toutes", "Neuf", "Occasion"];

  useEffect(() => {
    const controller = new AbortController();
    const payload: SearchFilters = {
      brand,
      city,
      fuel,
      condition,
    };

    const triggerSearch = async () => {
      setIsSearching(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: search,
            filters: payload,
            limit: 60,
          }),
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as SearchResponse;
        setResultMeta(data);
        setResults(
          data.hits
            .map((hit) => VEHICLE_BY_ID.get(hit.id))
            .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }
        console.warn("Search request failed, fallback to local filter", error);
        setResultMeta(null);
        setResults(filterLocally(search, payload));
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(triggerSearch, 200);

    return () => {
      controller.abort();
      clearTimeout(debounce);
    };
  }, [search, brand, city, fuel, condition]);

  const compareSuggestions = useMemo(() => {
    const groups = vehicles.reduce<Record<string, Vehicle[]>>((accumulator, vehicle) => {
      const key = `${vehicle.brand}-${vehicle.model}`.toLowerCase();
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(vehicle);
      return accumulator;
    }, {});

    return Object.values(groups)
      .filter((group) => group.length > 1)
      .slice(0, 3);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setBrand("Toutes");
    setCity("Toutes");
    setFuel("Tout");
    setCondition("Toutes");
  };

  return (
    <div className="space-y-12">
      <AnimatedSection className="grid gap-6 rounded-3xl border border-border bg-white/95 p-8 shadow-lg lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Filtres instantanés (Meilisearch-ready)
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tapez un mot-clé (marque, modèle, ville, concessionnaire) et combinez
            les filtres ci-dessous : la requête est envoyée vers Meilisearch si
            configuré, sinon nous retombons sur le filtre local mocké.
          </p>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher (ex : Hilux, Cotonou, Nexus…)"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              label="Énergie"
              value={fuel}
              options={fuelOptions}
              onChange={(value) => setFuel(value as FuelFilter)}
            />
            <FilterSelect
              label="Statut"
              value={condition}
              options={conditionOptions}
              onChange={(value) => setCondition(value as ConditionFilter)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              {isSearching
                ? "Recherche…"
                : `${results.length} résultat${results.length > 1 ? "s" : ""}`}
            </Badge>
            {resultMeta?.source === "meilisearch" ? (
              <Badge variant="outline" className="border-brand/30 text-brand">
                via Meilisearch
              </Badge>
            ) : null}
            {search || brand !== "Toutes" || city !== "Toutes" || fuel !== "Tout" ||
            condition !== "Toutes" ? (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
            ) : null}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-brand">
            Suggestion comparateur
          </p>
          <p className="text-sm text-muted-foreground">
            Ces modèles ont plusieurs offres — parfait pour la démo comparateur.
            Ajoutez-les via « Ajouter à comparer » pour les visualiser dans `/comparer`.
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
                  {group.length} annonces ({group.map((vehicle) => vehicle.city).join(", ")})
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        {results.length === 0 ? (
          <CardEmptyState search={search} />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {results.map((vehicle) => {
              const dealer = dealers.find((d) => d.id === vehicle.dealerId);
              return (
                <VehicleCard key={vehicle.id} vehicle={vehicle} dealer={dealer} />
              );
            })}
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps): JSX.Element {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {label}
      <select
        className="h-11 rounded-md border border-border bg-white px-3 text-sm font-medium text-foreground shadow-sm transition focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CardEmptyState({ search }: { search: string }): JSX.Element {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white/95 p-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Aucun résultat</h3>
      <p className="mt-3 text-sm text-muted-foreground">
        {search
          ? "Essayez un autre mot-clé ou réinitialisez les filtres pour visualiser toute la sélection."
          : "Ajustez les filtres pour explorer d'autres combinaisons et préparer la future expérience Meilisearch."}
      </p>
      <div className="mt-6 flex justify-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Badge variant="secondary">Temps réel</Badge>
        <Badge variant="secondary">Meilisearch</Badge>
        <Badge variant="secondary">Phase 2</Badge>
      </div>
    </div>
  );
}

function filterLocally(query: string, filters: SearchFilters): Vehicle[] {
  const normalizedQuery = query.trim().toLowerCase();

  return vehicles.filter((vehicle) => {
    if (filters.brand !== "Toutes" && vehicle.brand !== filters.brand) return false;
    if (filters.city !== "Toutes" && vehicle.city !== filters.city) return false;
    if (filters.fuel !== "Tout" && vehicle.fuel !== filters.fuel) return false;
    if (filters.condition !== "Toutes" && vehicle.condition !== filters.condition) return false;

    if (!normalizedQuery) return true;

    const dealer = dealers.find((d) => d.id === vehicle.dealerId);
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
  });
}
