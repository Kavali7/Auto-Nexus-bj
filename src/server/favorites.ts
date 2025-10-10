import { prisma } from "@/lib/prisma";
import { serializeVehicle } from "@/server/vehicles";
import { readVisitorTokenFromCookies } from "@/server/visitors";
import type { FavoriteSummary } from "@/types/catalog";

export async function getFavoriteSummariesByToken(
  token: string,
): Promise<FavoriteSummary[]> {
  if (!token) {
    return [];
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      visitor: {
        sessionToken: token,
      },
    },
    include: {
      vehicle: {
        include: {
          gallery: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites.map((favorite) => ({
    vehicle: serializeVehicle(favorite.vehicle),
    createdAt: favorite.createdAt.toISOString(),
  }));
}

export async function getFavoritesForCurrentVisitor(): Promise<FavoriteSummary[]> {
  const token = readVisitorTokenFromCookies();
  if (!token) {
    return [];
  }

  return getFavoriteSummariesByToken(token);
}
