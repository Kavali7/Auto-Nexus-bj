export type VehicleSpec = {
  label: string;
  value: string;
};

export type VehicleMediaKind =
  | "STANDARD"
  | "EXTERIOR"
  | "INTERIOR"
  | "DETAIL"
  | "PANORAMA"
  | "WALKAROUND";

export type VehicleGalleryItem = {
  id: string;
  url: string;
  label: string | null;
  kind: VehicleMediaKind;
  position: number;
};

export type VehicleSummary = {
  id: string;
  slug: string;
  dealerId: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  condition: string;
  mileage: number;
  mileageUnit: string;
  fuel: string;
  transmission: string;
  drivetrain: string | null;
  price: number;
  currency: string;
  city: string;
  doors: number | null;
  colorExterior: string | null;
  colorInterior: string | null;
  featured: boolean;
  heroImage: string;
  virtualTourUrl: string | null;
  gallery: VehicleGalleryItem[];
  highlights: string[];
  specs: VehicleSpec[];
  available: boolean;
};

export type FavoriteSummary = {
  vehicle: VehicleSummary;
  createdAt: string;
};

export type DealerSummary = {
  id: string;
  name: string;
  slug: string;
  city: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  headline: string | null;
  description: string | null;
  foundedYear: number | null;
  staffCount: number | null;
  rating: number | null;
  ratingCount: number | null;
  logo: string | null;
  address: string | null;
  specialties: string[];
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  inventorySize: number | null;
  heroImage: string | null;
  gallery: string[];
};
