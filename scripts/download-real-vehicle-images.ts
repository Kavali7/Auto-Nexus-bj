import "dotenv/config";

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";

import { vehicleDefinitions } from "@/data/vehicle-definitions";

type ImageTask = {
  path: string;
  queries: string[];
};

const OUTPUT_ROOT = resolve("public");
const SOURCE_BASE = "https://loremflickr.com";
const WIDTH = 2000;
const HEIGHT = 1333;
const CONCURRENCY = 3;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

const kindQueryMap: Record<string, string> = {
  EXTERIOR: "exterior car front view",
  INTERIOR: "luxury car interior seats dashboard",
  DETAIL: "car detail close-up headlight wheel",
  PANORAMA: "car driving landscape wideshot",
  WALKAROUND: "car side profile outdoor",
  STANDARD: "car photoshoot",
};

function normalizePath(path: string): string {
  return path.replace(/^\/*/, "");
}

function sanitize(value: string): string {
  return value.replace(/[+()]/g, "").replace(/\s+/g, " ").trim();
}

function buildTasks(): ImageTask[] {
  const tasks: ImageTask[] = [];

  for (const vehicle of vehicleDefinitions) {
    const sanitizedBrand = sanitize(vehicle.brand);
    const sanitizedModel = sanitize(vehicle.model ?? "");
    const baseQuery = `${sanitizedBrand} ${sanitizedModel}`.trim() || sanitizedBrand;

    const heroPath = normalizePath(vehicle.heroImagePath);
    tasks.push({
      path: heroPath,
      queries: [
        `${baseQuery} exterior front`,
        `${sanitizedBrand} exterior car`,
        "luxury car exterior",
      ],
    });

    vehicle.gallery.forEach((media) => {
      const normalized = normalizePath(media.file);
      const kindQuery = kindQueryMap[media.kind ?? "STANDARD"] ?? kindQueryMap.STANDARD;
      tasks.push({
        path: normalized,
        queries: [
          `${baseQuery} ${kindQuery}`,
          `${sanitizedBrand} ${kindQuery}`,
          `${sanitizedBrand} car`,
          "modern car photo",
        ],
      });
    });
  }

  return tasks;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function fetchImageBuffer(query: string): Promise<Buffer> {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .join(",");
  const url = `${SOURCE_BASE}/${WIDTH}/${HEIGHT}/${encodeURIComponent(keywords)}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
    });

    if (response.ok && response.body) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    if (attempt < MAX_RETRIES) {
      console.warn(
        `Retry ${attempt}/${MAX_RETRIES - 1} for query "${query}" (status ${response.status})`,
      );
      await sleep(RETRY_DELAY_MS * attempt);
      continue;
    }

    throw new Error(`Failed to fetch image for query "${query}" (status ${response.status})`);
  }

  throw new Error(`Failed to fetch image for query "${query}" after retries`);
}

async function downloadTask(task: ImageTask): Promise<void> {
  const outputPath = resolve(OUTPUT_ROOT, task.path);
  await mkdir(dirname(outputPath), { recursive: true });

  let buffer: Buffer | null = null;
  let lastError: Error | null = null;

  for (const query of task.queries) {
    try {
      buffer = await fetchImageBuffer(query);
      console.log(`Downloaded ${query} -> ${task.path}`);
      break;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Failed query "${query}" for ${task.path}: ${lastError.message}`);
    }
  }

  if (!buffer) {
    throw lastError ?? new Error(`Unable to download image for ${task.path}`);
  }

  // Ensure extension stays .jpg even if source is different
  const ext = extname(outputPath).toLowerCase();
  const targetPath =
    ext === ".jpg" || ext === ".jpeg" || ext === ".png" ? outputPath : `${outputPath}${ext ? "" : ".jpg"}`;

  await writeFile(targetPath, buffer);
}

async function runQueue(tasks: ImageTask[]): Promise<void> {
  const queue = [...tasks];
  const workers: Promise<void>[] = [];

  for (let i = 0; i < CONCURRENCY; i += 1) {
    const worker = (async () => {
      while (queue.length > 0) {
        const task = queue.shift();
        if (!task) {
          return;
        }
        try {
          await downloadTask(task);
        } catch (error) {
          console.error(`Failed to download ${task.path}:`, error);
        }
      }
    })();
    workers.push(worker);
  }

  await Promise.all(workers);
}

async function main(): Promise<void> {
  const tasks = buildTasks();
  console.log(`Preparing to download ${tasks.length} vehicle images into ${OUTPUT_ROOT}`);
  await runQueue(tasks);
}

main().catch((error) => {
  console.error("Vehicle image download failed:", error);
  process.exit(1);
});
