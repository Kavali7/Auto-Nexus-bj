export type FuelType =
  | "Essence"
  | "Diesel"
  | "Hybride"
  | "Électrique"
  | "GPL";

export type TransmissionType = "Automatique" | "Manuelle";

export type VehicleCondition = "Neuf" | "Occasion";

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  condition: VehicleCondition;
  mileage: number;
  mileageUnit: "km";
  price: number;
  currency: "XOF";
  city: string;
  fuel: FuelType;
  transmission: TransmissionType;
  drivetrain?: string;
  colorExterior: string;
  colorInterior?: string;
  doors: number;
  dealerId: string;
  featured?: boolean;
  heroImage: string;
  gallery: string[];
  highlights: string[];
  specs: VehicleSpec[];
  available: boolean;
}

export interface Dealer {
  id: string;
  name: string;
  slug: string;
  city: string;
  phone: string;
  whatsapp: string;
  email?: string;
  headline: string;
  rating: number;
  ratingCount: number;
  logo?: string;
  specialties: string[];
  address?: string;
  description?: string;
  website?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  foundedYear?: number;
  staffCount?: number;
  inventorySize?: number;
  heroImage?: string;
  gallery?: string[];
}

export interface ServicePillar {
  id: string;
  title: string;
  subtitle: string;
  partners: string[];
  description: string;
  icon?: string;
}
