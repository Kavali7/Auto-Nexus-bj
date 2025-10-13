import { randomUUID } from "node:crypto";
import { posix } from "node:path";

import { getSupabaseAdmin } from "./server";

const DEFAULT_BUCKET = "public-assets";

function sanitizeSegment(segment: string) {
  return segment
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
}

function makeDatePrefix() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function sanitizeFolder(folder?: string) {
  if (!folder) {
    return "uploads";
  }

  return folder
    .split("/")
    .map((segment) => sanitizeSegment(segment))
    .filter(Boolean)
    .join("/");
}

function sanitizeFilename(filename: string) {
  const ext = posix.extname(filename).toLowerCase();
  const base = posix.basename(filename, ext);

  const cleanBase = sanitizeSegment(base) || "asset";
  const cleanExt = ext.replace(/[^a-z0-9.]/g, "");

  return { cleanBase, cleanExt };
}

export type SignedUploadOptions = {
  filename: string;
  contentType?: string;
  folder?: string;
  expiresIn?: number;
  upsert?: boolean;
};

export type SignedUploadPayload = {
  bucket: string;
  path: string;
  signedUrl: string;
  uploadUrl: string;
  uploadHeaders: Record<string, string>;
  publicUrl: string;
  token: string;
  expiresIn: number;
  expiresAt: string;
};

export function getPublicStorageUrl(path: string, bucketName = getBucketName()) {
  const cleanPath = path.replace(/^\/*/, "");

  const cdnUrl = process.env.SUPABASE_CDN_URL?.replace(/\/+$/, "");
  const cdnHostname = process.env.SUPABASE_CDN_HOSTNAME;

  if (cdnUrl) {
    return `${cdnUrl}/${bucketName}/${cleanPath}`;
  }

  if (cdnHostname) {
    const protocol = process.env.SUPABASE_CDN_PROTOCOL || "https";
    return `${protocol}://${cdnHostname}/${bucketName}/${cleanPath}`;
  }

  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    return `/${cleanPath}`;
  }

  return new URL(
    `/storage/v1/object/public/${bucketName}/${cleanPath}`,
    supabaseUrl,
  ).toString();
}

export async function createSignedUploadUrl(
  options: SignedUploadOptions,
): Promise<SignedUploadPayload> {
  if (!options.filename) {
    throw new Error("Le nom de fichier est obligatoire pour creer un upload signe.");
  }

  const bucket = getBucketName();
  const supabase = getSupabaseAdmin();

  const folder = sanitizeFolder(options.folder);
  const { cleanBase, cleanExt } = sanitizeFilename(options.filename);
  const requestedExpiresIn =
    options.expiresIn && Number.isFinite(options.expiresIn)
      ? Math.max(15, Math.min(7200, Math.round(options.expiresIn)))
      : 300;
  const supabaseMaxExpiresIn = 7200; // Supabase tokens are hard-limited to 2 hours.
  const effectiveExpiresIn = Math.min(requestedExpiresIn, supabaseMaxExpiresIn);
  const upsert = options.upsert ?? true;
  const contentType = options.contentType || "application/octet-stream";

  const path = posix.join(
    folder,
    makeDatePrefix(),
    `${randomUUID()}-${cleanBase}${cleanExt}`,
  );

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path, {
      upsert,
    });

  if (error || !data) {
    throw new Error(
      `Impossible de creer l'URL d'upload signee Supabase: ${error?.message ?? "erreur inconnue"}`,
    );
  }

  return {
    bucket,
    path: data.path,
    signedUrl: data.signedUrl,
    uploadUrl: data.signedUrl,
    uploadHeaders: {
      "Content-Type": contentType,
    },
    publicUrl: getPublicStorageUrl(data.path, bucket),
    token: data.token,
    expiresIn: effectiveExpiresIn,
    expiresAt: new Date(Date.now() + effectiveExpiresIn * 1000).toISOString(),
  };
}
