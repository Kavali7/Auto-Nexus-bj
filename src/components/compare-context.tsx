"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { DealerSummary } from "@/types/catalog";

export type CompareVehicle = {
  id: string;
  slug: string;
  dealerId: string;
  brand: string;
  model: string;
  trim: string | null;
  condition: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  price: number;
  city: string;
  heroImage: string;
  highlights: string[];
};

type CompareContextValue = {
  selectedIds: string[];
  selectedVehicles: CompareVehicle[];
  isSelected: (vehicleId: string) => boolean;
  canAddMore: boolean;
  addVehicle: (vehicleId: string) => void;
  removeVehicle: (vehicleId: string) => void;
  clear: () => void;
  findDealer: (dealerId: string) => DealerSummary | undefined;
};

const MAX_COMPARE = 4;
const STORAGE_KEY = "auto-nexus-compare";

interface CompareProviderProps {
  children: React.ReactNode;
  vehicles: CompareVehicle[];
  dealers: DealerSummary[];
}

const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export function CompareProvider({
  children,
  vehicles,
  dealers,
}: CompareProviderProps): JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle] as const)),
    [vehicles],
  );

  const dealerMap = useMemo(
    () => new Map(dealers.map((dealer) => [dealer.id, dealer] as const)),
    [dealers],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed.slice(0, MAX_COMPARE));
        }
      } catch (error) {
        console.warn("Unable to parse compare storage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const addVehicle = useCallback((vehicleId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(vehicleId)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, vehicleId];
    });
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== vehicleId));
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const findDealer = useCallback(
    (dealerId: string) => dealerMap.get(dealerId),
    [dealerMap],
  );

  const selectedVehicles = useMemo(
    () =>
      selectedIds
        .map((id) => vehicleMap.get(id))
        .filter((vehicle): vehicle is CompareVehicle => Boolean(vehicle)),
    [selectedIds, vehicleMap],
  );

  const contextValue: CompareContextValue = useMemo(
    () => ({
      selectedIds,
      selectedVehicles,
      isSelected: (vehicleId: string) => selectedIds.includes(vehicleId),
      canAddMore: selectedIds.length < MAX_COMPARE,
      addVehicle,
      removeVehicle,
      clear,
      findDealer,
    }),
    [selectedIds, selectedVehicles, addVehicle, removeVehicle, clear, findDealer],
  );

  return (
    <CompareContext.Provider value={contextValue}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
