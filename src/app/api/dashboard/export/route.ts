import { NextResponse } from "next/server";

import { dealers, vehicles } from "@/data";

export async function GET() {
  const payload = {
    generatedAt: new Date().toISOString(),
    summary: {
      dealers: dealers.length,
      vehicles: vehicles.length,
      highlightedBrands: Array.from(new Set(vehicles.map((v) => v.brand))).slice(0, 5),
    },
    dealers,
    vehicles,
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": "attachment; filename=auto-nexus-data-room.json",
    },
  });
}
