import "dotenv/config";

import { writeFileSync } from "node:fs";
import { posix } from "node:path";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/storage";

type CloudinaryResource = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  bytes: number;
  format: string;
  resource_type: string;
  folder?: string;
};

type CloudinaryListResponse = {
  resources: CloudinaryResource[];
  next_cursor?: string;
};

type MigrationContext = {
  bucket: string;
  targetPrefix: string;
  dryRun: boolean;
  upsert: boolean;
};

type MigrationManifestEntry = {
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  bytes: number;
  resourceType: string;
  supabasePath: string;
  supabasePublicUrl: string;
  status: "uploaded" | "skipped" | "dry-run" | "failed";
  error?: string;
};

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function sanitizeSegment(segment: string): string {
  return segment
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function inferExtension(resource: CloudinaryResource): string {
  if (resource.format) {
    return resource.format.replace(/[^a-z0-9]/gi, "").toLowerCase();
  }

  const url = resource.secure_url || resource.url || "";
  const matches = /\.([a-z0-9]+)(?:\?|$)/i.exec(url);
  return matches?.[1]?.toLowerCase() ?? "";
}

function inferContentType(resource: CloudinaryResource, extension: string): string {
  if (resource.resource_type === "image") {
    if (extension === "jpg") {
      return "image/jpeg";
    }

    if (extension === "svg") {
      return "image/svg+xml";
    }

    return `image/${extension || "jpeg"}`;
  }

  if (resource.resource_type === "video") {
    return `video/${extension || "mp4"}`;
  }

  if (resource.resource_type === "raw" && extension === "pdf") {
    return "application/pdf";
  }

  return "application/octet-stream";
}

function buildTargetPath(
  resource: CloudinaryResource,
  extension: string,
  prefix: string,
): string {
  const sanitizedSegments = resource.public_id
    .split("/")
    .map((segment) => sanitizeSegment(segment))
    .filter(Boolean);

  if (sanitizedSegments.length === 0) {
    sanitizedSegments.push("asset");
  }

  const fileName = sanitizedSegments.pop() ?? "asset";
  const safeExtension = extension ? `.${extension}` : "";

  return posix.join(prefix, ...sanitizedSegments, `${fileName}${safeExtension}`);
}

async function fetchCloudinaryPage(params: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  resourceType: string;
  deliveryType: string;
  prefix?: string;
  nextCursor?: string;
  maxResults: number;
}): Promise<CloudinaryListResponse> {
  const {
    cloudName,
    apiKey,
    apiSecret,
    resourceType,
    deliveryType,
    prefix,
    nextCursor,
    maxResults,
  } = params;

  const url = new URL(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/${deliveryType}`,
  );

  url.searchParams.set("max_results", String(Math.min(500, Math.max(1, maxResults))));

  if (prefix) {
    url.searchParams.set("prefix", prefix);
  }

  if (nextCursor) {
    url.searchParams.set("next_cursor", nextCursor);
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Cloudinary API error (${response.status} ${response.statusText}): ${errorBody}`,
    );
  }

  return (await response.json()) as CloudinaryListResponse;
}

async function listCloudinaryResources(options: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  resourceType: string;
  deliveryType: string;
  prefix?: string;
  max: number;
  resumeCursor?: string;
}): Promise<CloudinaryResource[]> {
  const resources: CloudinaryResource[] = [];
  let nextCursor = options.resumeCursor;

  while (true) {
    if (resources.length >= options.max) {
      break;
    }

    const remaining = options.max - resources.length;

    const page = await fetchCloudinaryPage({
      cloudName: options.cloudName,
      apiKey: options.apiKey,
      apiSecret: options.apiSecret,
      resourceType: options.resourceType,
      deliveryType: options.deliveryType,
      prefix: options.prefix,
      nextCursor,
      maxResults: Math.min(remaining, 500),
    });

    resources.push(...page.resources);

    if (!page.next_cursor) {
      break;
    }

    nextCursor = page.next_cursor;
  }

  return resources.slice(0, options.max);
}

async function migrateResource(
  resource: CloudinaryResource,
  context: MigrationContext,
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
): Promise<MigrationManifestEntry> {
  const extension = inferExtension(resource);
  const contentType = inferContentType(resource, extension);
  const supabasePath = buildTargetPath(resource, extension, context.targetPrefix);
  const publicUrl = getPublicStorageUrl(supabasePath, context.bucket);

  if (context.dryRun) {
    return {
      cloudinaryPublicId: resource.public_id,
      cloudinaryUrl: resource.secure_url || resource.url,
      bytes: resource.bytes,
      resourceType: resource.resource_type,
      supabasePath,
      supabasePublicUrl: publicUrl,
      status: "dry-run",
    };
  }

  const downloadResponse = await fetch(resource.secure_url || resource.url);

  if (!downloadResponse.ok) {
    return {
      cloudinaryPublicId: resource.public_id,
      cloudinaryUrl: resource.secure_url || resource.url,
      bytes: resource.bytes,
      resourceType: resource.resource_type,
      supabasePath,
      supabasePublicUrl: publicUrl,
      status: "failed",
      error: `Download failed (${downloadResponse.status}): ${await downloadResponse.text()}`,
    };
  }

  const arrayBuffer = await downloadResponse.arrayBuffer();

  const { error } = await supabaseAdmin.storage.from(context.bucket).upload(
    supabasePath,
    arrayBuffer,
    {
      contentType,
      upsert: context.upsert,
    },
  );

  if (error) {
    return {
      cloudinaryPublicId: resource.public_id,
      cloudinaryUrl: resource.secure_url || resource.url,
      bytes: resource.bytes,
      resourceType: resource.resource_type,
      supabasePath,
      supabasePublicUrl: publicUrl,
      status: error.message.includes("already exists") ? "skipped" : "failed",
      error: error.message,
    };
  }

  return {
    cloudinaryPublicId: resource.public_id,
    cloudinaryUrl: resource.secure_url || resource.url,
    bytes: resource.bytes,
    resourceType: resource.resource_type,
    supabasePath,
    supabasePublicUrl: publicUrl,
    status: "uploaded",
  };
}

async function main() {
  const cloudName = assertEnv("CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME);
  const apiKey = assertEnv("CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY);
  const apiSecret = assertEnv("CLOUDINARY_API_SECRET", process.env.CLOUDINARY_API_SECRET);

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "public-assets";
  const targetPrefix = process.env.SUPABASE_MIGRATION_PREFIX || "imports/cloudinary";
  const resourceType = process.env.CLOUDINARY_RESOURCE_TYPE || "image";
  const deliveryType = process.env.CLOUDINARY_DELIVERY_TYPE || "upload";
  const prefix = process.env.CLOUDINARY_FOLDER || undefined;
  const dryRun = String(process.env.DRY_RUN || "").toLowerCase() === "true";
  const upsert =
    String(process.env.SUPABASE_MIGRATION_UPSERT || "").toLowerCase() !== "false";
  const resumeCursor = process.env.CLOUDINARY_RESUME_CURSOR || undefined;

  const maxAssetsEnv = process.env.CLOUDINARY_MAX_ASSETS;
  const maxAssets =
    maxAssetsEnv && /^\d+$/.test(maxAssetsEnv) ? Number(maxAssetsEnv) : 500;

  const manifestPath = process.env.MIGRATION_MANIFEST_PATH || "";

  console.log("---- Cloudinary -> Supabase migration ----");
  console.log(`Bucket: ${bucket}`);
  console.log(`Target prefix: ${targetPrefix}`);
  console.log(`Dry-run: ${dryRun ? "yes" : "no"}`);
  console.log(`Upsert existing: ${upsert ? "yes" : "no"}`);
  console.log(
    `Cloudinary resource: ${resourceType}/${deliveryType} (prefix: ${prefix || "none"})`,
  );
  if (resumeCursor) {
    console.log(`Resume cursor provided: ${resumeCursor}`);
  }
  console.log(`Max assets to process: ${maxAssets}`);
  if (manifestPath) {
    console.log(`Manifest output: ${manifestPath}`);
  }
  console.log("");

  const resources = await listCloudinaryResources({
    cloudName,
    apiKey,
    apiSecret,
    resourceType,
    deliveryType,
    prefix,
    max: maxAssets,
    resumeCursor,
  });

  if (resources.length === 0) {
    console.log("No Cloudinary resources matched the criteria. Nothing to do.");
    return;
  }

  console.log(`Fetched ${resources.length} resource(s) from Cloudinary.`);

  const supabaseAdmin = getSupabaseAdmin();

  const manifest: MigrationManifestEntry[] = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [index, resource] of resources.entries()) {
    const position = `${index + 1}/${resources.length}`;
    console.log(
      `[${position}] ${resource.public_id} (${Math.round(resource.bytes / 1024)} kB)`,
    );

    try {
      const entry = await migrateResource(
        resource,
        { bucket, targetPrefix, dryRun, upsert },
        supabaseAdmin,
      );
      manifest.push(entry);

      if (entry.status === "uploaded") {
        uploaded += 1;
        console.log(`  -> uploaded to ${entry.supabasePath}`);
      } else if (entry.status === "skipped") {
        skipped += 1;
        console.log(`  -> skipped (${entry.error})`);
      } else if (entry.status === "dry-run") {
        skipped += 1;
        console.log(`  -> dry-run preview`);
      } else {
        failed += 1;
        console.warn(`  -> failed: ${entry.error}`);
      }
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      manifest.push({
        cloudinaryPublicId: resource.public_id,
        cloudinaryUrl: resource.secure_url || resource.url,
        bytes: resource.bytes,
        resourceType: resource.resource_type,
        supabasePath: "",
        supabasePublicUrl: "",
        status: "failed",
        error: message,
      });
      console.warn(`  -> unexpected error: ${message}`);
    }
  }

  console.log("");
  console.log("Migration summary:");
  console.log(`- Uploaded: ${uploaded}`);
  console.log(`- Skipped: ${skipped}`);
  console.log(`- Failed: ${failed}`);

  if (manifestPath) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
    console.log(`Manifest written to ${manifestPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
