import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { vehicles as seedVehicles } from "@/data/vehicles";
import type { Vehicle as SeedVehicle } from "@/data/types";
import { prisma } from "@/lib/prisma";
import { DEALERS_TAG, VEHICLES_TAG } from "@/server/cache-tags";
import type { VehicleGalleryItem, VehicleSpec, VehicleSummary } from "@/types/catalog";

type VehicleWithGallery = Prisma.VehicleGetPayload<{ include: { gallery: true } }>;

const logFallback = (context: string, error: unknown) => {
  console.warn(`[prisma:fallback] ${context}`, error);
};

const buildGalleryFromSeed = (vehicle: SeedVehicle): VehicleGalleryItem[] =>
  vehicle.gallery.map((item, index) => ({
    id: `${vehicle.id}-media-${index}`,
    url: item.url,
    label: item.label ?? null,
    kind: item.kind ?? "STANDARD",
    position: index,
  }));

const mapSeedVehicleToSummary = (vehicle: SeedVehicle): VehicleSummary => {
  const gallery = buildGalleryFromSeed(vehicle);
  return {
    id: vehicle.id,
    slug: vehicle.slug,
    dealerId: vehicle.dealerId,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim ?? null,
    year: vehicle.year,
    condition: vehicle.condition,
    mileage: vehicle.mileage,
    mileageUnit: vehicle.mileageUnit ?? "km",
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    drivetrain: vehicle.drivetrain ?? null,
    price: vehicle.price,
    currency: vehicle.currency ?? "XOF",
    city: vehicle.city,
    doors: vehicle.doors ?? null,
    colorExterior: vehicle.colorExterior ?? null,
    colorInterior: vehicle.colorInterior ?? null,
    featured: vehicle.featured ?? false,
    heroImage: vehicle.heroImage,
    virtualTourUrl: vehicle.virtualTourUrl ?? null,
    gallery,
    highlights: [...vehicle.highlights],
    specs: vehicle.specs.map((spec) => ({
      label: spec.label,
      value: spec.value,
    })),
    available: vehicle.available,
  };
};

const seedVehicleSummaries = seedVehicles.map(mapSeedVehicleToSummary);
const seedVehiclesById = new Map(
  seedVehicleSummaries.map((vehicle) => [vehicle.id, vehicle] as const),
);
const seedVehiclesBySlug = new Map(
  seedVehicleSummaries.map((vehicle) => [vehicle.slug, vehicle] as const),
);

const cloneVehicle = (vehicle: VehicleSummary): VehicleSummary => ({
  ...vehicle,
  gallery: vehicle.gallery.map((item) => ({ ...item })),
  specs: vehicle.specs.map((spec) => ({ ...spec })),
  highlights: [...vehicle.highlights],
});

const getSeedVehicleSummaries = (): VehicleSummary[] =>
  seedVehicleSummaries.map(cloneVehicle);

export const serializeVehicle = (vehicle: VehicleWithGallery): VehicleSummary => {
  const specs = Array.isArray(vehicle.specs) ? (vehicle.specs as VehicleSpec[]) : [];

  const gallery: VehicleGalleryItem[] = vehicle.gallery
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      label: photo.label ?? null,
      kind: photo.kind ?? "STANDARD",
      position: photo.position ?? 0,
    }))
    .sort((a, b) => a.position - b.position);

  const heroImage = vehicle.heroImage ?? gallery[0]?.url ?? "/brand/anx-logo.png";

  return {
    id: vehicle.id,
    slug: vehicle.slug,
    dealerId: vehicle.dealerId,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim ?? null,
    year: vehicle.year,
    condition: vehicle.condition,
    mileage: vehicle.mileage,
    mileageUnit: vehicle.mileageUnit ?? "km",
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    drivetrain: vehicle.drivetrain ?? null,
    price: vehicle.price,
    currency: vehicle.currency ?? "XOF",
    city: vehicle.city,
    doors: vehicle.doors ?? null,
    colorExterior: vehicle.colorExterior ?? null,
    colorInterior: vehicle.colorInterior ?? null,
    featured: vehicle.featured ?? false,
    heroImage,
    virtualTourUrl: vehicle.virtualTourUrl ?? null,
    gallery,
    highlights: vehicle.highlights ?? [],
    specs: specs.map((spec) => ({
      label: spec.label,
      value: spec.value,
    })),
    available: vehicle.available,
  };
};

export const getVehicleSummariesByIds = async (
  ids: string[],
): Promise<VehicleSummary[]> => {
  if (ids.length === 0) {
    return [];
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        gallery: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!vehicles.length) {
      return ids
        .map((id) => seedVehiclesById.get(id))
        .filter((vehicle): vehicle is VehicleSummary => Boolean(vehicle))
        .map(cloneVehicle);
    }

    return vehicles.map(serializeVehicle);
  } catch (error) {
    logFallback("vehicle summaries by ids", error);
    return ids
      .map((id) => seedVehiclesById.get(id))
      .filter((vehicle): vehicle is VehicleSummary => Boolean(vehicle))
      .map(cloneVehicle);
  }
};

const fetchVehicles = async (): Promise<VehicleSummary[]> => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        gallery: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: [{ featured: "desc" }, { year: "desc" }, { updatedAt: "desc" }],
    });

    if (!vehicles.length) {
      return getSeedVehicleSummaries();
    }

    return vehicles.map(serializeVehicle);
  } catch (error) {
    logFallback("fetch vehicles", error);
    return getSeedVehicleSummaries();
  }
};

export const getVehicles = unstable_cache(fetchVehicles, ["vehicles:all"], {
  tags: [VEHICLES_TAG, DEALERS_TAG],
});

const fetchFeaturedVehicles = async (limit = 6): Promise<VehicleSummary[]> => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        available: true,
      },
      include: {
        gallery: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: [{ featured: "desc" }, { year: "desc" }, { updatedAt: "desc" }],
      take: limit,
    });

    if (!vehicles.length) {
      return getSeedVehicleSummaries()
        .filter((vehicle) => vehicle.available)
        .slice(0, limit);
    }

    return vehicles.map(serializeVehicle);
  } catch (error) {
    logFallback("fetch featured vehicles", error);
    return getSeedVehicleSummaries()
      .filter((vehicle) => vehicle.available)
      .slice(0, limit);
  }
};

export const getFeaturedVehicles = unstable_cache(
  async (limit = 6) => fetchFeaturedVehicles(limit),
  ["vehicles:featured"],
  {
    tags: [VEHICLES_TAG, DEALERS_TAG],
  },
);

export const getVehicleSlugs = unstable_cache(
  async () => {
    try {
      const vehicles = await prisma.vehicle.findMany({
        select: {
          slug: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!vehicles.length) {
        return getSeedVehicleSummaries().map((vehicle) => vehicle.slug);
      }

      return vehicles.map((vehicle) => vehicle.slug);
    } catch (error) {
      logFallback("fetch vehicle slugs", error);
      return getSeedVehicleSummaries().map((vehicle) => vehicle.slug);
    }
  },
  ["vehicles:slugs"],
  {
    tags: [VEHICLES_TAG],
  },
);

export const getVehicleBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: {
          slug,
        },
        include: {
          gallery: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (vehicle) {
        return serializeVehicle(vehicle);
      }
    } catch (error) {
      logFallback(`fetch vehicle by slug (${slug})`, error);
    }

    const fallback = seedVehiclesBySlug.get(slug);
    return fallback ? cloneVehicle(fallback) : null;
  },
  ["vehicles:by-slug"],
  {
    tags: [VEHICLES_TAG, DEALERS_TAG],
  },
);

type RelatedVehiclesParams = {
  brand: string;
  model: string;
  excludeId?: string;
  limit?: number;
};

export const getRelatedVehicles = unstable_cache(
  async (params: RelatedVehiclesParams) => {
    const { brand, model, excludeId, limit = 3 } = params;

    const where: Prisma.VehicleWhereInput = {
      brand,
      model,
    };

    if (excludeId) {
      where.id = {
        not: excludeId,
      };
    }

    try {
      const vehicles = await prisma.vehicle.findMany({
        where,
        include: {
          gallery: {
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
      });

      if (!vehicles.length) {
        return getSeedVehicleSummaries()
          .filter(
            (vehicle) =>
              vehicle.brand === brand &&
              vehicle.model === model &&
              vehicle.id !== excludeId,
          )
          .slice(0, limit);
      }

      return vehicles.map(serializeVehicle);
    } catch (error) {
      logFallback("fetch related vehicles", error);
      return getSeedVehicleSummaries()
        .filter(
          (vehicle) =>
            vehicle.brand === brand &&
            vehicle.model === model &&
            vehicle.id !== excludeId,
        )
        .slice(0, limit);
    }
  },
  ["vehicles:related"],
  {
    tags: [VEHICLES_TAG, DEALERS_TAG],
  },
);
