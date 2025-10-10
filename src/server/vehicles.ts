import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import { DEALERS_TAG, VEHICLES_TAG } from "@/server/cache-tags";
import type { VehicleGalleryItem, VehicleSpec, VehicleSummary } from "@/types/catalog";

type VehicleWithGallery = Prisma.VehicleGetPayload<{ include: { gallery: true } }>;

export const serializeVehicle = (vehicle: VehicleWithGallery): VehicleSummary => {
  const specs = Array.isArray(vehicle.specs)
    ? (vehicle.specs as VehicleSpec[])
    : [];

  const gallery: VehicleGalleryItem[] = vehicle.gallery
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      label: photo.label ?? null,
      kind: photo.kind ?? "STANDARD",
      position: photo.position ?? 0,
    }))
    .sort((a, b) => a.position - b.position);

  const heroImage =
    vehicle.heroImage ?? gallery[0]?.url ?? "/brand/anx-logo.png";

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

export const getVehicleSummariesByIds = async (ids: string[]): Promise<VehicleSummary[]> => {
  if (ids.length === 0) {
    return [];
  }

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

  return vehicles.map(serializeVehicle);
};

const fetchVehicles = async () => {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      gallery: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: [
      { featured: "desc" },
      { year: "desc" },
      { updatedAt: "desc" },
    ],
  });

  return vehicles.map(serializeVehicle);
};

export const getVehicles = unstable_cache(fetchVehicles, ["vehicles:all"], {
  tags: [VEHICLES_TAG, DEALERS_TAG],
});

const fetchFeaturedVehicles = async (limit = 6) => {
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
    orderBy: [
      { featured: "desc" },
      { year: "desc" },
      { updatedAt: "desc" },
    ],
    take: limit,
  });

  return vehicles.map(serializeVehicle);
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
    const vehicles = await prisma.vehicle.findMany({
      select: {
        slug: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return vehicles.map((vehicle) => vehicle.slug);
  },
  ["vehicles:slugs"],
  {
    tags: [VEHICLES_TAG],
  },
);

export const getVehicleBySlug = unstable_cache(
  async (slug: string) => {
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

    if (!vehicle) {
      return null;
    }

    return serializeVehicle(vehicle);
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

    return vehicles.map(serializeVehicle);
  },
  ["vehicles:related"],
  {
    tags: [VEHICLES_TAG, DEALERS_TAG],
  },
);
