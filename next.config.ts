import type { ImageConfig, NextConfig } from "next";

const remotePatterns: NonNullable<ImageConfig["remotePatterns"]> = [];

function addRemotePattern(pattern: { protocol: string; hostname: string }) {
  if (!pattern.hostname) {
    return;
  }

  const alreadyPresent = remotePatterns.some(
    (existing) =>
      existing.hostname === pattern.hostname &&
      existing.protocol === pattern.protocol,
  );

  if (!alreadyPresent) {
    remotePatterns.push(pattern);
  }
}

const supabaseUrl = process.env.SUPABASE_URL;

if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    addRemotePattern({ protocol: url.protocol.replace(/:$/, ""), hostname: url.hostname });
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
    addRemotePattern({ protocol: url.protocol.replace(/:$/, ""), hostname: url.hostname });
  } catch (error) {
    console.warn("SUPABASE_CDN_URL invalide, impossible d'ajouter au remotePatterns:", error);
  }
}

const cdnHostname = process.env.SUPABASE_CDN_HOSTNAME;
if (cdnHostname) {
  addRemotePattern({
    protocol: process.env.SUPABASE_CDN_PROTOCOL || "https",
    hostname: cdnHostname,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
