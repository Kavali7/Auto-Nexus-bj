import "dotenv/config";

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";

import { encode } from "blurhash";
import sharp from "sharp";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";

type MediaKind =
  | "EXTERIOR"
  | "INTERIOR"
  | "DETAIL"
  | "PANORAMA"
  | "HERO"
  | "LOGO"
  | "SERVICE";

type MediaEntity = "vehicle" | "dealer" | "service";

type ManifestEntry = {
  source: string;
  target: string;
  label: string;
  kind: MediaKind;
  position: number;
  entity: MediaEntity;
  entityId: string;
};

type VariantSummary = {
  path: string;
  format: "jpg" | "webp" | "avif";
  width: number;
  height: number;
  size: number;
  publicUrl: string;
  metadata: Record<string, string>;
};

type UploadSummary = {
  entry: ManifestEntry;
  variants: VariantSummary[];
  blurhash: string;
};

function getManifestPath(cliArg?: string): string {
  if (cliArg) {
    return resolve(cliArg);
  }

  const defaultPath = resolve("scripts", "media-manifest.json");
  return defaultPath;
}

async function ensureFile(path: string): Promise<void> {
  try {
    await fs.access(path);
  } catch {
    throw new Error(
      `Fichier source introuvable pour le media: ${path}. Ajoutez le fichier original avant de lancer le script.`,
    );
  }
}

async function computeBlurhash(buffer: Buffer): Promise<{
  blurhash: string;
  width: number;
  height: number;
}> {
  const base = sharp(buffer);

  const { data, info } = await base
    .clone()
    .resize(32, 32, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const uint8 = new Uint8ClampedArray(data);
  const blurhash = encode(uint8, info.width, info.height, 4, 4);

  return {
    blurhash,
    width: info.width,
    height: info.height,
  };
}

async function prepareVariants(buffer: Buffer): Promise<{
  jpg: { data: Buffer; width: number; height: number; size: number };
  webp: { data: Buffer; width: number; height: number; size: number };
  avif: { data: Buffer; width: number; height: number; size: number };
}> {
  const base = sharp(buffer, { failOn: "error" }).rotate();

  const jpgResult = await base
    .clone()
    .resize({
      width: 2000,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 88,
      chromaSubsampling: "4:4:4",
      progressive: true,
    })
    .toBuffer({ resolveWithObject: true });

  const webpResult = await base
    .clone()
    .resize({
      width: 2000,
      withoutEnlargement: true,
    })
    .webp({
      quality: 82,
      effort: 5,
    })
    .toBuffer({ resolveWithObject: true });

  const avifResult = await base
    .clone()
    .resize({
      width: 2000,
      withoutEnlargement: true,
    })
    .avif({
      quality: 60,
      effort: 6,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    jpg: {
      data: jpgResult.data,
      width: jpgResult.info.width,
      height: jpgResult.info.height,
      size: jpgResult.info.size,
    },
    webp: {
      data: webpResult.data,
      width: webpResult.info.width,
      height: webpResult.info.height,
      size: webpResult.info.size,
    },
    avif: {
      data: avifResult.data,
      width: avifResult.info.width,
      height: avifResult.info.height,
      size: avifResult.info.size,
    },
  };
}

function createMetadata(
  entry: ManifestEntry,
  variant: "jpg" | "webp" | "avif",
  basePath: string,
  dimensions: { width: number; height: number },
  blurhash: string,
): Record<string, string> {
  const metadata: Record<string, string> = {
    label: entry.label,
    position: String(entry.position),
    kind: entry.kind,
    entity: entry.entity,
    entity_id: entry.entityId,
    width: String(dimensions.width),
    height: String(dimensions.height),
    blurhash,
    variant,
  };

  if (variant !== "jpg") {
    metadata.variant_of = `${basePath}.jpg`;
  }

  return metadata;
}

async function uploadVariant(
  supabase: ReturnType<typeof getSupabaseAdmin> | null,
  params: {
    bucket: string;
    path: string;
    buffer: Buffer;
    contentType: string;
    metadata: Record<string, string>;
    dryRun: boolean;
  },
): Promise<void> {
  if (params.dryRun) {
    return;
  }

  if (!supabase) {
    throw new Error(
      "Client Supabase manquant pour uploader les variantes (dry-run est false).",
    );
  }

  const response = await supabase.storage
    .from(params.bucket)
    .upload(params.path, params.buffer, {
      contentType: params.contentType,
      cacheControl: "31536000",
      upsert: true,
    });

  if (response.error) {
    throw new Error(`Echec upload Supabase (${params.path}): ${response.error.message}`);
  }

  void params.metadata;
}

async function processManifest({
  manifestPath,
  dryRun,
  outputPath,
}: {
  manifestPath: string;
  dryRun: boolean;
  outputPath: string;
}): Promise<UploadSummary[]> {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "Auto-Nexus-bj";

  let entries: ManifestEntry[] = [];
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    entries = JSON.parse(raw) as ManifestEntry[];
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      throw new Error(
        `Manifest introuvable: ${manifestPath}. Copiez scripts/media-manifest.example.json vers scripts/media-manifest.json et renseignez vos assets.`,
      );
    }

    throw error;
  }

  const supabase = dryRun ? null : getSupabaseAdmin();

  const summaries: UploadSummary[] = [];

  for (const entry of entries) {
    const sourcePath = resolve(entry.source);
    await ensureFile(sourcePath);

    const buffer = await fs.readFile(sourcePath);

    const [{ blurhash }, variants] = await Promise.all([
      computeBlurhash(buffer),
      prepareVariants(buffer),
    ]);

    const normalizedTarget = entry.target.replace(/\\/g, "/");
    const basePath = normalizedTarget.replace(/(\.jpg|\.jpeg|\.png|\.webp|\.avif)$/i, "");

    const variantConfigs: Array<{
      key: keyof typeof variants;
      extension: "jpg" | "webp" | "avif";
      contentType: string;
    }> = [
      { key: "jpg", extension: "jpg", contentType: "image/jpeg" },
      { key: "webp", extension: "webp", contentType: "image/webp" },
      { key: "avif", extension: "avif", contentType: "image/avif" },
    ];

    const variantSummaries: VariantSummary[] = [];

    for (const config of variantConfigs) {
      const variant = variants[config.key];
      const resolvedPath = normalizedTarget.endsWith(`.${config.extension}`)
        ? normalizedTarget
        : `${basePath}.${config.extension}`;

      const metadata = createMetadata(
        entry,
        config.extension,
        basePath,
        {
          width: variant.width,
          height: variant.height,
        },
        blurhash,
      );

      await uploadVariant(supabase, {
        bucket,
        path: resolvedPath,
        buffer: variant.data,
        contentType: config.contentType,
        metadata,
        dryRun,
      });

      const publicUrl = getPublicStorageUrl(resolvedPath, bucket);

      variantSummaries.push({
        path: resolvedPath,
        format: config.extension,
        width: variant.width,
        height: variant.height,
        size: variant.size,
        publicUrl,
        metadata,
      });
    }

    summaries.push({
      entry,
      variants: variantSummaries,
      blurhash,
    });
  }

  if (!dryRun) {
    await fs.mkdir(dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(summaries, null, 2), "utf8");
  }

  return summaries;
}

async function main(): Promise<void> {
  const manifestArg = process.argv.find((arg) => arg.endsWith(".json"));
  const manifestPath = getManifestPath(manifestArg);
  const dryRun = process.argv.includes("--dry-run");

  const outputPath = resolve(
    "scripts",
    dryRun ? "media-upload-preview.json" : "media-upload-result.json",
  );

  console.log("---- Pipeline media Auto Nexus BJ ----");
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Dry-run: ${dryRun ? "oui" : "non"}`);
  console.log("");

  const results = await processManifest({
    manifestPath,
    dryRun,
    outputPath,
  });

  let uploadedCount = 0;
  for (const result of results) {
    console.log(
      `Media: ${result.entry.target} (${result.entry.label}, ${result.entry.kind})`,
    );
    for (const variant of result.variants) {
      console.log(
        `  - ${variant.format} -> ${variant.path} (${variant.width}x${variant.height}, ${Math.round(variant.size / 1024)} kB)`,
      );
      console.log(`    URL: ${variant.publicUrl}`);
    }
    uploadedCount += 1;
    console.log("");
  }

  if (!dryRun) {
    console.log(
      `Manifest de sortie enregistree: ${outputPath} (${uploadedCount} media).`,
    );
  } else {
    console.log("Dry-run termine. Aucune donnee n'a ete envoyee a Supabase.");
  }
}

main().catch((error) => {
  console.error("Echec de la pipeline media:");
  console.error(error);
  process.exit(1);
});
