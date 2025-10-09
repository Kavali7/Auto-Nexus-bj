import { NextRequest, NextResponse } from "next/server";

import { createSignedUploadUrl } from "@/lib/supabase/storage";

type UploadPayload = {
  filename?: unknown;
  contentType?: unknown;
  folder?: unknown;
  expiresIn?: unknown;
};

export async function POST(request: NextRequest) {
  let payload: UploadPayload = {};

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Requete JSON invalide pour /api/uploads/sign", error);
    return NextResponse.json(
      { error: "Corps JSON invalide." },
      { status: 400 },
    );
  }

  const { filename, contentType, folder, expiresIn } = payload;

  if (typeof filename !== "string" || filename.length === 0) {
    return NextResponse.json(
      { error: "Le champ `filename` est obligatoire." },
      { status: 400 },
    );
  }

  try {
    const signedUpload = await createSignedUploadUrl({
      filename,
      contentType: typeof contentType === "string" ? contentType : undefined,
      folder: typeof folder === "string" ? folder : undefined,
      expiresIn:
        typeof expiresIn === "number" && Number.isFinite(expiresIn)
          ? Math.max(15, Math.min(300, Math.round(expiresIn)))
          : undefined,
    });

    return NextResponse.json(signedUpload);
  } catch (error) {
    console.error("Erreur Supabase lors de la generation d'URL signee", error);
    return NextResponse.json(
      {
        error:
          "Impossible de generer une URL signee Supabase (verifiez vos credentials et le bucket).",
      },
      { status: 500 },
    );
  }
}
