import { dealers, getDealers } from "./dealers";
import { services } from "./services";
import { vehicles, getVehicles } from "./vehicles";
import type { Dealer, ServicePillar, Vehicle } from "./types";

export { dealers, services, vehicles, getDealers, getVehicles };
export type { Dealer, ServicePillar, Vehicle };

export function getDealerById(id: string): Dealer | undefined {
  return dealers.find((dealer) => dealer.id === id);
}

export function getDealerBySlug(slug: string): Dealer | undefined {
  return dealers.find((dealer) => dealer.slug === slug);
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getFeaturedVehicles(limit = 6): Vehicle[] {
  return [...vehicles]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.year - a.year;
    })
    .slice(0, limit);
}

export function getVehiclesByDealer(dealerId: string): Vehicle[] {
  return vehicles.filter((vehicle) => vehicle.dealerId === dealerId);
}

export function getRelatedVehicles(vehicle: Vehicle, limit = 3): Vehicle[] {
  return vehicles
    .filter(
      (candidate) =>
        candidate.id !== vehicle.id &&
        candidate.brand === vehicle.brand &&
        candidate.model === vehicle.model,
    )
    .slice(0, limit);
}
