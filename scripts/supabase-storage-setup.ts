import "dotenv/config";

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
