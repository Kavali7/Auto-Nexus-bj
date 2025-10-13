import { NextResponse } from "next/server";

const UPLOAD_MESSAGE =
  "Generation d URL signee simulee : connectez Supabase Storage pour activer l upload.";

export async function POST() {
  return NextResponse.json(
    {
      demo: true,
      message: UPLOAD_MESSAGE,
    },
    { status: 202, headers: { "Cache-Control": "no-store" } },
  );
}
