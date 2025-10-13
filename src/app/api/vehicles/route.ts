import { NextResponse } from "next/server";

import { vehicles as seedVehicles } from "@/data/vehicles";

const VEHICLES_MESSAGE =
  "Jeu de donnees statique : les vehicules sont servis depuis les mocks en attendant Prisma.";

export async function GET() {
  return NextResponse.json(
    {
      vehicles: seedVehicles,
      demo: true,
      message: VEHICLES_MESSAGE,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message:
        "Creation d'annonce disponible apres activation de Prisma (fonctionnalite en demo).",
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
