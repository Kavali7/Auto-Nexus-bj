import "dotenv/config";

import { dealers, vehicles } from "@/data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.vehiclePhoto.deleteMany({});
  await prisma.upload.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.dealer.deleteMany({});

  await prisma.$transaction(
    dealers.map((dealer) =>
      prisma.dealer.create({
        data: {
          id: dealer.id,
          name: dealer.name,
          slug: dealer.slug,
          city: dealer.city,
          phone: dealer.phone,
          whatsapp: dealer.whatsapp,
          email: dealer.email,
          headline: dealer.headline,
          description: dealer.description,
          foundedYear: dealer.foundedYear,
          staffCount: dealer.staffCount,
        },
      }),
    ),
  );

  for (const vehicle of vehicles) {
    await prisma.vehicle.create({
      data: {
        id: vehicle.id,
        slug: vehicle.slug,
        dealerId: vehicle.dealerId,
        brand: vehicle.brand,
        model: vehicle.model,
        trim: vehicle.trim,
        year: vehicle.year,
        condition: vehicle.condition,
        mileage: vehicle.mileage,
        fuel: vehicle.fuel,
        transmission: vehicle.transmission,
        price: vehicle.price,
        city: vehicle.city,
        heroImage: vehicle.heroImage,
        highlights: vehicle.highlights,
        available: vehicle.available,
        gallery: {
          create: vehicle.gallery.map((url, index) => ({
            url,
            position: index,
          })),
        },
      },
    });
  }

  console.log("Seed Prisma terminé ✅");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
