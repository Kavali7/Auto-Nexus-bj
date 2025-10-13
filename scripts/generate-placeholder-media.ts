import "dotenv/config";

import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";

import sharp from "sharp";

import { dealerDefinitions } from "@/data/dealer-definitions";
import { vehicleDefinitions } from "@/data/vehicle-definitions";

type Palette = {
  start: string;
  end: string;
};

type PlaceholderTask = {
  sourcePath: string;
  title: string;
  subtitle: string;
  palette: Palette;
};

const OUTPUT_ROOT = resolve("assets", "raw-media");

const vehiclePalette: Record<string, Palette> = {
  EXTERIOR: { start: "#0f172a", end: "#1d4ed8" },
  INTERIOR: { start: "#111827", end: "#7c3aed" },
  DETAIL: { start: "#0f172a", end: "#0f766e" },
  PANORAMA: { start: "#0f172a", end: "#f97316" },
  WALKAROUND: { start: "#0f172a", end: "#dc2626" },
  STANDARD: { start: "#111827", end: "#2563eb" },
};

const dealerPalette: Palette[] = [
  { start: "#0f172a", end: "#06b6d4" },
  { start: "#111827", end: "#6366f1" },
  { start: "#0f172a", end: "#22c55e" },
  { start: "#111827", end: "#8b5cf6" },
  { start: "#0f172a", end: "#f97316" },
];

function normalizeTargetPath(path: string): string {
  return path.replace(/^\/*/, "").replace(/\\/g, "/");
}

function buildVehicleTasks(): Map<string, PlaceholderTask> {
  const tasks = new Map<string, PlaceholderTask>();

  for (const vehicle of vehicleDefinitions) {
    vehicle.gallery.forEach((media, index) => {
      const normalized = normalizeTargetPath(media.file);
      const pngSource = normalized.replace(/\.jpg$/i, ".png");
      const sourcePath = resolve(OUTPUT_ROOT, pngSource);
      const palette = vehiclePalette[media.kind] ?? vehiclePalette.STANDARD;

      tasks.set(normalized, {
        sourcePath,
        title: `${vehicle.brand} ${vehicle.model}`,
        subtitle: media.label,
        palette,
      });
    });
  }

  return tasks;
}

function buildDealerTasks(): Map<string, PlaceholderTask> {
  const tasks = new Map<string, PlaceholderTask>();

  dealerDefinitions.forEach((dealer, dealerIndex) => {
    const palette = dealerPalette[dealerIndex % dealerPalette.length];

    const heroPath = normalizeTargetPath(dealer.heroImagePath);
    tasks.set(heroPath, {
      sourcePath: resolve(OUTPUT_ROOT, heroPath.replace(/\.jpg$/i, ".png")),
      title: dealer.name,
      subtitle: dealer.headline,
      palette,
    });

    dealer.galleryPaths.forEach((path, index) => {
      const normalized = normalizeTargetPath(path);
      tasks.set(normalized, {
        sourcePath: resolve(OUTPUT_ROOT, normalized.replace(/\.jpg$/i, ".png")),
        title: dealer.name,
        subtitle:
          index === 0
            ? "Showroom & exposition"
            : index === 1
              ? "Livraison client"
              : "Atelier & services",
        palette,
      });
    });
  });

  return tasks;
}

async function ensureDirectory(filePath: string): Promise<void> {
  await fs.mkdir(dirname(filePath), { recursive: true });
}

function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generatePlaceholder(task: PlaceholderTask): Promise<void> {
  const { sourcePath, title, subtitle, palette } = task;

  try {
    await fs.access(sourcePath);
    return;
  } catch {
    // continue
  }

  await ensureDirectory(sourcePath);

  const width = 2000;
  const height = 1333;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.start}"/>
      <stop offset="100%" stop-color="${palette.end}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="80" y="${height - 320}" width="${width - 160}" height="240" rx="28" fill="rgba(15,23,42,0.35)"/>
  <text x="120" y="${height - 200}" font-family="'Inter', sans-serif" font-weight="600" font-size="92" fill="white">${escapeSvgText(
    title,
  )}</text>
  <text x="120" y="${height - 120}" font-family="'Inter', sans-serif" font-weight="400" font-size="54" fill="rgba(248,250,252,0.88)">${escapeSvgText(
    subtitle,
  )}</text>
</svg>
`;

  const svgBuffer = Buffer.from(svg);

  await sharp(svgBuffer).png({ quality: 100 }).toFile(sourcePath);
}

async function main(): Promise<void> {
  const vehicleTasks = buildVehicleTasks();
  const dealerTasks = buildDealerTasks();

  const mergedTasks = new Map<string, PlaceholderTask>([...vehicleTasks, ...dealerTasks]);

  let created = 0;
  for (const task of mergedTasks.values()) {
    await generatePlaceholder(task);
    created += 1;
  }

  console.log(
    `Placeholders générés ou déjà présents: ${created} fichier(s) dans ${OUTPUT_ROOT}.`,
  );
}

main().catch((error) => {
  console.error("Echec génération placeholders:", error);
  process.exit(1);
});
