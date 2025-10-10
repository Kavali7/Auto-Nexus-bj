import "dotenv/config";

import { randomUUID } from "node:crypto";

import { createSignedUploadUrl } from "@/lib/supabase/storage";

async function main() {
  const now = new Date().toISOString();
  const filename = `cli-check-${randomUUID()}.png`;

  console.log("Creating signed upload URL...");

  const signed = await createSignedUploadUrl({
    filename,
    contentType: "image/png",
    folder: "cli-checks",
    expiresIn: 120,
    upsert: false,
  });

  console.log(`Signed URL received. Target path: ${signed.path}`);

  const pixelBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
  const payload = Buffer.from(pixelBase64, "base64");

  const response = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: {
      ...signed.uploadHeaders,
      "Content-Type": "image/png",
    },
    body: payload,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Upload failed (${response.status}): ${errorBody || "unknown error"}`,
    );
  }

  console.log("Upload successful!");
  console.log(`Public URL: ${signed.publicUrl}`);
  console.log(`Token: ${signed.token}`);
  console.log(`Expires at: ${signed.expiresAt}`);
}

main().catch((error) => {
  console.error("Verification failed:");
  console.error(error);
  process.exit(1);
});
