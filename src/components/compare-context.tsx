"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getVehicles, type Vehicle } from "@/data";

type CompareContextValue = {
  selectedIds: string[];
  selectedVehicles: Vehicle[];
  isSelected: (vehicleId: string) => boolean;
  canAddMore: boolean;
  addVehicle: (vehicleId: string) => void;
  removeVehicle: (vehicleId: string) => void;
  clear: () => void;
};

const MAX_COMPARE = 4;
const STORAGE_KEY = "auto-nexus-compare";

const VEHICLES_DATASET = getVehicles();
const vehicleMap = new Map(
  VEHICLES_DATASET.map((vehicle) => [vehicle.id, vehicle]),
);

const CompareContext = createContext<CompareContextValue | undefined>(
  undefined,
);

export function CompareProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const selectedVehicles = useMemo(
    () =>
      selectedIds
        .map((id) => vehicleMap.get(id))
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
    [selectedIds],
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
    }),
    [selectedIds, selectedVehicles, addVehicle, removeVehicle, clear],
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
