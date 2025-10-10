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
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL manquant pour calculer l'URL publique.");
  }

  return new URL(
    `/storage/v1/object/public/${bucketName}/${path}`,
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
  const expiresIn =
    options.expiresIn && Number.isFinite(options.expiresIn)
      ? Math.max(15, Math.min(300, Math.round(options.expiresIn)))
      : 60;
  const upsert = options.upsert ?? true;
  const contentType = options.contentType || "application/octet-stream";

  const path = posix.join(
    folder,
    makeDatePrefix(),
    `${randomUUID()}-${cleanBase}${cleanExt}`,
  );

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path, expiresIn, {
      upsert,
      contentType,
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
      "x-upsert": upsert ? "true" : "false",
    },
    publicUrl: getPublicStorageUrl(data.path, bucket),
    token: data.token,
    expiresIn,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
  };
}
