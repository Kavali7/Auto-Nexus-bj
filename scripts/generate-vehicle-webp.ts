import "dotenv/config";

import { promises as fs } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";

import sharp from "sharp";

const SOURCE_ROOT = resolve("public", "vehicles");
const VALID_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const QUALITY = Number.parseInt(process.env.VEHICLE_WEBP_QUALITY ?? "", 10) || 80;

type Summary = {
  created: number;
  skipped: number;
  failed: number;
};

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(filePath: string): Promise<void> {
  await fs.mkdir(dirname(filePath), { recursive: true });
}

async function convertToWebp(inputPath: string): Promise<boolean> {
  const ext = extname(inputPath).toLowerCase();
  if (!VALID_EXTENSIONS.has(ext)) {
    return false;
  }

  const outputPath = inputPath.slice(0, -ext.length) + ".webp";
  if (await pathExists(outputPath)) {
    return false;
  }

  await ensureDirectory(outputPath);

  await sharp(inputPath)
    .rotate()
    .resize({
      width: 2000,
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY })
    .toFile(outputPath);

  return true;
}

async function walkDirectory(dirPath: string, summary: Summary): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() === "blur") {
        summary.skipped += 1;
        continue;
      }
      await walkDirectory(entryPath, summary);
      continue;
    }

    try {
      const created = await convertToWebp(entryPath);
      if (created) {
        summary.created += 1;
        console.log(
          `Generated: ${basename(entryPath)} -> ${basename(entryPath).replace(extname(entryPath), ".webp")}`,
        );
      } else {
        summary.skipped += 1;
      }
    } catch (error) {
      summary.failed += 1;
      console.error(`Failed to convert ${entryPath}:`, error);
    }
  }
}

async function main(): Promise<void> {
  const summary: Summary = { created: 0, skipped: 0, failed: 0 };

  const exists = await pathExists(SOURCE_ROOT);
  if (!exists) {
    throw new Error(`Source directory not found: ${SOURCE_ROOT}`);
  }

  await walkDirectory(SOURCE_ROOT, summary);

  console.log(
    `WebP generation summary -> created: ${summary.created}, skipped: ${summary.skipped}, failed: ${summary.failed}`,
  );
}

main().catch((error) => {
  console.error("Vehicle WebP generation failed:", error);
  process.exit(1);
});
