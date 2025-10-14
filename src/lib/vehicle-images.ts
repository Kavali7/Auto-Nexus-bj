declare const __non_webpack_require__: NodeRequire | undefined;

const VEHICLE_IMAGE_PREFIX = "/vehicles/";
const VEHICLE_BLUR_PREFIX = "/vehicles/blur/";

type NodeModules =
  | {
      existsSync: (path: string) => boolean;
      join: (...segments: string[]) => string;
    }
  | null;

const nodeRuntimeModules: NodeModules = (() => {
  if (typeof window !== "undefined") {
    return null;
  }

  try {
    // Turbopack/webpack tree shaking ignores require hidden behind eval.
    const safeRequire: NodeRequire =
      typeof __non_webpack_require__ === "function"
        ? __non_webpack_require__
        : (eval("require") as NodeRequire);

    const fs = safeRequire("node:fs") as typeof import("node:fs");
    const path = safeRequire("node:path") as typeof import("node:path");

    return {
      existsSync: fs.existsSync,
      join: path.join,
    };
  } catch {
    return null;
  }
})();

function findBlurVariant(filename: string): string | undefined {
  const node = nodeRuntimeModules;
  if (!node) {
    return undefined;
  }

  const originalExt = (() => {
    const match = /\.([a-z0-9]+)$/i.exec(filename);
    return match ? `.${match[1]}` : "";
  })();
  const baseName = originalExt
    ? filename.slice(0, -originalExt.length)
    : filename;

  const candidates = [
    filename,
    `${baseName}.jpg`,
    `${baseName}.jpeg`,
    `${baseName}.png`,
    `${baseName}.webp`,
  ];

  for (const candidate of candidates) {
    const candidatePath = node.join(process.cwd(), "public", "vehicles", "blur", candidate);
    if (node.existsSync(candidatePath)) {
      return candidate;
    }
  }

  return undefined;
}

export const DEFAULT_VEHICLE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgY0J7tYAAAAASUVORK5CYII=";

export function getVehicleBlurDataUrl(
  imageUrl: string | null | undefined,
  fallback: string = DEFAULT_VEHICLE_BLUR_DATA_URL,
): string {
  if (!imageUrl) {
    return fallback;
  }

  try {
    const [path] = imageUrl.split("?");
    if (!path.startsWith(VEHICLE_IMAGE_PREFIX)) {
      return fallback;
    }

    const filename = path.slice(VEHICLE_IMAGE_PREFIX.length);
    if (!filename) {
      return fallback;
    }

    const blurVariant = findBlurVariant(filename);
    if (!blurVariant) {
      return fallback;
    }

    return `${VEHICLE_BLUR_PREFIX}${blurVariant}`;
  } catch {
    return fallback;
  }
}
