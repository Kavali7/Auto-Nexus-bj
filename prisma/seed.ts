import "dotenv/config";

import { dealers, vehicles } from "@/data";
import { Prisma, PrismaClient } from "@prisma/client";

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
          rating: dealer.rating,
          ratingCount: dealer.ratingCount,
          logo: dealer.logo,
          address: dealer.address,
          specialties: dealer.specialties ?? [],
          website: dealer.website,
          instagram: dealer.social?.instagram,
          facebook: dealer.social?.facebook,
          linkedin: dealer.social?.linkedin,
          inventorySize: dealer.inventorySize,
          heroImage: dealer.heroImage,
          gallery: dealer.gallery ?? [],
        },
      }),
    ),
  );

  for (const vehicle of vehicles) {
    const vehicleData: Prisma.VehicleCreateInput = {
      id: vehicle.id,
      slug: vehicle.slug,
      dealer: {
        connect: {
          id: vehicle.dealerId,
        },
      },
      brand: vehicle.brand,
      model: vehicle.model,
      trim: vehicle.trim,
      year: vehicle.year,
      condition: vehicle.condition,
      mileage: vehicle.mileage,
      mileageUnit: vehicle.mileageUnit ?? "km",
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain,
      price: vehicle.price,
      currency: vehicle.currency,
      city: vehicle.city,
      doors: vehicle.doors,
      colorExterior: vehicle.colorExterior,
      colorInterior: vehicle.colorInterior,
      featured: vehicle.featured ?? false,
      heroImage: vehicle.heroImage,
      specs: JSON.parse(JSON.stringify(vehicle.specs ?? [])) as Prisma.JsonArray,
      highlights: vehicle.highlights,
      available: vehicle.available,
      gallery: {
        create: vehicle.gallery.map((photo, index) => ({
          url: photo.url,
          label: photo.label,
          kind: photo.kind ?? "STANDARD",
          position: index,
        })),
      },
    };

    if (vehicle.virtualTourUrl) {
      vehicleData.virtualTourUrl = vehicle.virtualTourUrl;
    }

    await prisma.vehicle.create({
      data: vehicleData,
    });
  }

  console.log("Prisma seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
