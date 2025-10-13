import { NextResponse } from "next/server";

const FAVORITES_MESSAGE =
  "Mode demo : favoris et comparateur seront actifs apres la connexion Prisma/Supabase.";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      favorites: [],
      demo: true,
      message: FAVORITES_MESSAGE,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message: FAVORITES_MESSAGE,
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: true,
      demo: true,
      message: FAVORITES_MESSAGE,
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
