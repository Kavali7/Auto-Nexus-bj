const VEHICLE_IMAGE_PREFIX = "/vehicles/";
const VEHICLE_BLUR_PREFIX = "/vehicles/blur/";

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

    return `${VEHICLE_BLUR_PREFIX}${filename}`;
  } catch {
    return fallback;
  }
}
