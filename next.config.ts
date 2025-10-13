import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [];

function normalizeProtocol(value?: string | null): RemotePattern["protocol"] {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/:$/, "");
  return normalized === "http" || normalized === "https" ? normalized : undefined;
}

function addRemotePattern(pattern: RemotePattern) {
  if (!pattern.hostname) {
    return;
  }

  const alreadyPresent = remotePatterns.some(
    (existing) =>
      existing.hostname === pattern.hostname && existing.protocol === pattern.protocol,
  );

  if (!alreadyPresent) {
    remotePatterns.push(pattern);
  }
}

const supabaseUrl = process.env.SUPABASE_URL;

if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    addRemotePattern({
      protocol: normalizeProtocol(url.protocol),
      hostname: url.hostname,
    });
  } catch (error) {
    console.warn("SUPABASE_URL invalide, impossible d'ajouter au remotePatterns:", error);
  }
}

addRemotePattern({ protocol: "https", hostname: "images.unsplash.com" });
addRemotePattern({ protocol: "https", hostname: "plus.unsplash.com" });

const cdnUrl = process.env.SUPABASE_CDN_URL;

if (cdnUrl) {
  try {
    const url = new URL(cdnUrl);
    addRemotePattern({
      protocol: normalizeProtocol(url.protocol),
      hostname: url.hostname,
    });
  } catch (error) {
    console.warn(
      "SUPABASE_CDN_URL invalide, impossible d'ajouter au remotePatterns:",
      error,
    );
  }
}

const cdnHostname = process.env.SUPABASE_CDN_HOSTNAME;
if (cdnHostname) {
  addRemotePattern({
    protocol: normalizeProtocol(process.env.SUPABASE_CDN_PROTOCOL),
    hostname: cdnHostname,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    domains: ["images.unsplash.com", "plus.unsplash.com"],
  },
};

export default nextConfig;
