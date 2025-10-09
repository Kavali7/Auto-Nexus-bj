import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { gallery: true, dealer: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("[GET]/api/vehicles", error);
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        slug: body.slug,
        dealerId: body.dealerId,
        brand: body.brand,
        model: body.model,
        trim: body.trim,
        year: body.year,
        condition: body.condition,
        mileage: body.mileage,
        fuel: body.fuel,
        transmission: body.transmission,
        price: body.price,
        city: body.city,
        heroImage: body.heroImage,
        highlights: body.highlights ?? [],
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error("[POST]/api/vehicles", error);
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }
}
