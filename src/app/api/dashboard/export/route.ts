import { NextResponse } from "next/server";

import { getDealers, getVehicles } from "@/data";

export async function GET() {
  const dealersDataset = getDealers();
  const vehiclesDataset = getVehicles();

  const payload = {
    generatedAt: new Date().toISOString(),
    summary: {
      dealers: dealersDataset.length,
      vehicles: vehiclesDataset.length,
      highlightedBrands: Array.from(new Set(vehiclesDataset.map((v) => v.brand))).slice(
        0,
        5,
      ),
    },
    dealers: dealersDataset,
    vehicles: vehiclesDataset,
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": "attachment; filename=auto-nexus-data-room.json",
    },
  });
}
