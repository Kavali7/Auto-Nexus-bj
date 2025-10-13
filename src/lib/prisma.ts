type VehicleDelegate = {
  findMany: (...args: unknown[]) => Promise<unknown>;
  create: (...args: unknown[]) => Promise<unknown>;
};

type PrismaClientLike = {
  vehicle: VehicleDelegate;
  $transaction: (...args: unknown[]) => Promise<unknown>;
  $disconnect: () => Promise<void>;
};

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientLike;
};

function createPrismaFallback(): PrismaClientLike {
  const error = new Error("Prisma client unavailable in this environment.");
  return {
    vehicle: {
      async findMany() {
        throw error;
      },
      async create() {
        throw error;
      },
    },
    async $transaction() {
      throw error;
    },
    async $disconnect() {
      throw error;
    },
  };
}

type PrismaClientConstructor = new (...args: unknown[]) => PrismaClientLike;

function loadPrismaClient(): PrismaClientLike {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as {
      PrismaClient: PrismaClientConstructor;
    };

    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } catch (error) {
    console.warn("[prisma] Prisma client not generated, falling back to stub.", error);
    return createPrismaFallback();
  }
}

export const prisma: PrismaClientLike =
  globalForPrisma.prisma ??
  loadPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
