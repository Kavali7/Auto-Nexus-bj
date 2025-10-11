import "dotenv/config";

import type { FileObject } from "@supabase/storage-js";

import { getSupabaseAdmin } from "@/lib/supabase/server";

async function main() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "public-assets";
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL manquant dans l'environnement.");
  }

  const supabase = getSupabaseAdmin();

  const { data: existingBucket, error: getError } =
    await supabase.storage.getBucket(bucket);

  if (getError && !/not found/i.test(getError.message ?? "")) {
    throw new Error(
      `Erreur Supabase lors de la lecture du bucket: ${getError.message}`,
    );
  }

  if (existingBucket) {
    console.log(
      `Bucket "${bucket}" deja present (public=${existingBucket.public}, fileSizeLimit=${existingBucket.file_size_limit ?? "illimite"}).`,
    );
  } else {
    console.log(`Bucket "${bucket}" introuvable. Creation en cours...`);

    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: ["image/*"],
    });

    if (createError) {
      throw new Error(
        `Impossible de creer le bucket "${bucket}": ${createError.message}`,
      );
    }

    console.log(
      `Bucket "${bucket}" cree avec succes (public, limite 10 Mo, images autorisees).`,
    );
  }

  console.log("");
  console.log("Prochaines etapes recommandees:");
  console.log(
    "- Appliquer les policies RLS de storage (voir scripts/supabase-storage-policies.sql).",
  );
  console.log(
    "- Ajuster allowedMimeTypes/fileSizeLimit selon vos besoins (via Supabase UI ou CLI).",
  );
  console.log(
    "- Verifier depuis la console Supabase que le bucket est bien public si vous servez les assets directement.",
  );

  const folders = ["vehicles", "dealers", "services", "tmp/uploads"];
  const keepPayload = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
    "base64",
  );

  for (const folder of folders) {
    const keepPath = `${folder}/.keep`;
    const { data: fileExists } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 1 });

    const alreadyExists =
      fileExists?.some((entry: FileObject) => entry.name === ".keep") ?? false;

    if (alreadyExists) {
      console.log(`Dossier "${folder}/" deja present.`);
      continue;
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(keepPath, keepPayload, {
        cacheControl: "31536000",
        upsert: true,
        contentType: "image/png",
      });

    if (uploadError) {
      console.warn(
        `Impossible de creer le dossier virtuel "${folder}/": ${uploadError.message}`,
      );
      continue;
    }

    console.log(`Dossier "${folder}/" initialise (fichier ${keepPath}).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
