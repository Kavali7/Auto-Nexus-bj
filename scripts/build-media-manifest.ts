import "dotenv/config";

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";

import { dealerDefinitions } from "@/data/dealer-definitions";
import { vehicleDefinitions } from "@/data/vehicle-definitions";

type ManifestEntry = {
  source: string;
  target: string;
  label: string;
  kind: string;
  position: number;
  entity: "vehicle" | "dealer";
  entityId: string;
};

function toPngSource(path: string): string {
  return path.replace(/\.jpg$/i, ".png");
}

function withoutExtension(path: string): string {
  return path.replace(/\.[^.]+$/i, "");
}

async function buildManifest(): Promise<ManifestEntry[]> {
  const entries: ManifestEntry[] = [];

  for (const vehicle of vehicleDefinitions) {
    vehicle.gallery.forEach((media, index) => {
      const target = withoutExtension(media.file);

      entries.push({
        source: resolve("assets", "raw-media", toPngSource(media.file)),
        target,
        label: media.label,
        kind: media.kind,
        position: index + 1,
        entity: "vehicle",
        entityId: vehicle.id,
      });
    });
  }

  dealerDefinitions.forEach((dealer) => {
    const heroTarget = withoutExtension(dealer.heroImagePath);
    entries.push({
      source: resolve("assets", "raw-media", toPngSource(dealer.heroImagePath)),
      target: heroTarget,
      label: "Vitrine principale",
      kind: "HERO",
      position: 1,
      entity: "dealer",
      entityId: dealer.id,
    });

    dealer.galleryPaths.forEach((path, index) => {
      const labels = [
        "Showroom & exposition",
        "Livraison client",
        "Atelier & services",
      ];

      entries.push({
        source: resolve("assets", "raw-media", toPngSource(path)),
        target: withoutExtension(path),
        label: labels[index] ?? "Vue concession",
        kind: "SERVICE",
        position: index + 2,
        entity: "dealer",
        entityId: dealer.id,
      });
    });
  });

  return entries;
}

async function main(): Promise<void> {
  const manifest = await buildManifest();
  const outputPath = resolve("scripts", "media-manifest.json");

  await fs.mkdir(dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  console.log(`Manifest media généré: ${outputPath} (${manifest.length} entrées).`);
}

main().catch((error) => {
  console.error("Echec génération manifest:", error);
  process.exit(1);
});
