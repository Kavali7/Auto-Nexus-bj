"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  SyntheticEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VehicleGalleryItem } from "@/types/catalog";

type VehicleGalleryProps = {
  items: VehicleGalleryItem[];
  fallbackImage: string;
  vehicleName: string;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const FALLBACK_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgY0J7tYAAAAASUVORK5CYII=";

function buildImageSources(url: string): { primary: string; fallback: string } {
  if (!url) {
    return { primary: url, fallback: url };
  }

  const questionIndex = url.indexOf("?");
  const base = questionIndex >= 0 ? url.slice(0, questionIndex) : url;
  const query = questionIndex >= 0 ? url.slice(questionIndex) : "";

  if (!/\.[a-z0-9]+$/i.test(base)) {
    return { primary: url, fallback: url };
  }

  if (base.toLowerCase().endsWith(".webp")) {
    return { primary: url, fallback: url };
  }

  const webpCandidate = `${base.replace(/\.[a-z0-9]+$/i, ".webp")}${query}`;
  return { primary: webpCandidate, fallback: url };
}

function createOnErrorHandler(fallback: string) {
  return (event: SyntheticEvent<HTMLImageElement>) => {
    if (!fallback) {
      return;
    }

    const target = event.currentTarget;
    if (target.src === fallback) {
      return;
    }

    target.onerror = null;
    target.src = fallback;
  };
}

export function VehicleGallery({
  items,
  fallbackImage,
  vehicleName,
}: VehicleGalleryProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const hasGallery = items.length > 0;
  const [primary, secondary] = useMemo(() => {
    if (!hasGallery) {
      return [null, [] as VehicleGalleryItem[]];
    }

    const [first, ...rest] = items;
    return [first, rest];
  }, [hasGallery, items]);

  const primaryUrl = primary?.url ?? fallbackImage;
  const primarySources = useMemo(() => buildImageSources(primaryUrl), [primaryUrl]);

  const fallbackSources = useMemo(
    () => buildImageSources(fallbackImage),
    [fallbackImage],
  );

  const activeThumbnailIndex = activeIndex ?? 0;
  const activePhoto = activeIndex !== null ? items[activeIndex] : null;
  const activeUrl = activePhoto?.url ?? fallbackImage;
  const activeSources = useMemo(() => buildImageSources(activeUrl), [activeUrl]);
  const activeAlt = activePhoto?.label ?? vehicleName;

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
    offsetRef.current = { x: 0, y: 0 };
    setIsDragging(false);
  }, []);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    resetZoom();
  }, [resetZoom]);
  const showPrevious = useCallback(() => {
    if (items.length === 0) return;
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === 0 ? items.length - 1 : current - 1;
    });
  }, [items]);
  const showNext = useCallback(() => {
    if (items.length === 0) return;
    setActiveIndex((current) => {
      if (current === null) return null;
      return current === items.length - 1 ? 0 : current + 1;
    });
  }, [items]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }
    resetZoom();
  }, [activeIndex, resetZoom]);

  const clampZoom = (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const handleZoomChange = (step: number) => {
    setZoom((previous) => {
      const next = clampZoom(previous + step);
      if (next === MIN_ZOOM) {
        setOffset({ x: 0, y: 0 });
        offsetRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (activeIndex === null) {
      return;
    }
    event.preventDefault();
    const direction = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    handleZoomChange(direction);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== null) {
      return;
    }
    pointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    offsetStartRef.current = offsetRef.current;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;

    if (zoom > MIN_ZOOM) {
      const next = {
        x: offsetStartRef.current.x + dx,
        y: offsetStartRef.current.y + dy,
      };
      offsetRef.current = next;
      setOffset(next);
    }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);

    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;

    if (zoom > MIN_ZOOM) {
      const finalOffset = {
        x: offsetStartRef.current.x + dx,
        y: offsetStartRef.current.y + dy,
      };
      offsetRef.current = finalOffset;
      setOffset(finalOffset);
    } else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    pointerIdRef.current = null;
    dragStartRef.current = { x: 0, y: 0 };
    offsetStartRef.current = offsetRef.current;
  };

  const handleDoubleClick = () => {
    setZoom((previous) => {
      const toggled = previous > MIN_ZOOM ? MIN_ZOOM : MIN_ZOOM + 1;
      if (toggled === MIN_ZOOM) {
        setOffset({ x: 0, y: 0 });
        offsetRef.current = { x: 0, y: 0 };
      }
      return toggled;
    });
  };

  if (!hasGallery || !primary) {
    return (
      <Card className="border-border/70 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Galerie en preparation</CardTitle>
          <CardDescription>
            La galerie sera alimentee par Supabase Storage lors de la phase suivante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src={fallbackSources.primary}
              alt={vehicleName}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={FALLBACK_BLUR_DATA_URL}
              sizes="(max-width: 1024px) 100vw, 50vw"
              onError={createOnErrorHandler(fallbackSources.fallback)}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleSecondary = secondary.slice(0, 4);
  const remainingCount = secondary.length - visibleSecondary.length;

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <button
          type="button"
          className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted"
          onClick={() => openLightbox(0)}
          aria-label="Ouvrir la photo principale en plein ecran"
        >
          <Image
            src={primarySources.primary}
            alt={primary.label ?? vehicleName}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            priority
            placeholder="blur"
            blurDataURL={FALLBACK_BLUR_DATA_URL}
            sizes="(min-width: 1024px) 60vw, 100vw"
            onError={createOnErrorHandler(primarySources.fallback)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-black/60 px-4 py-1 text-xs uppercase tracking-[0.18em] text-white">
            Photo principale
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-semibold text-white">
            <span>Voir en plein ecran</span>
          </div>
        </button>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleSecondary.map((photo, index) => {
            const absoluteIndex = index + 1;
            const isLast = index === visibleSecondary.length - 1;
            const sources = buildImageSources(photo.url);
            return (
              <button
                key={photo.id ?? `${photo.url}-${index}`}
                type="button"
                className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted"
                onClick={() => openLightbox(absoluteIndex)}
                aria-label="Ouvrir la photo en plein ecran"
              >
                <Image
                  src={sources.primary}
                  alt={photo.label ?? vehicleName}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={FALLBACK_BLUR_DATA_URL}
                  sizes="(min-width: 1024px) 40vw, 50vw"
                  onError={createOnErrorHandler(sources.fallback)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                {photo.label ? (
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white">
                    {photo.label}
                  </div>
                ) : null}
                {isLast && remainingCount > 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold uppercase tracking-[0.2em] text-white">
                    +{remainingCount}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
        {items.map((photo, index) => {
          const isActive = index === activeThumbnailIndex;
          const sources = buildImageSources(photo.url);
          return (
            <button
              key={photo.id ?? `${photo.url}-thumb-${index}`}
              type="button"
              onClick={() => openLightbox(index)}
              className={`rounded-2xl border ${isActive ? "border-brand bg-brand/10" : "border-border/60 bg-muted/30"} p-1 transition hover:border-brand`}
              aria-label={`Afficher la photo ${index + 1}`}
            >
              <span className="relative block h-16 w-24 overflow-hidden rounded-xl">
                <Image
                  src={sources.primary}
                  alt={photo.label ?? vehicleName}
                  fill
                  className="object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={FALLBACK_BLUR_DATA_URL}
                  sizes="96px"
                  onError={createOnErrorHandler(sources.fallback)}
                />
              </span>
            </button>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 text-white"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.18em]">
              Galerie media ({activeIndex + 1}/{items.length})
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">
                Zoom x{zoom.toFixed(1)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => handleZoomChange(-ZOOM_STEP)}
              >
                -
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => handleZoomChange(ZOOM_STEP)}
              >
                +
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={resetZoom}
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={showPrevious}
              >
                Precedent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={showNext}
              >
                Suivant
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={closeLightbox}
              >
                Fermer
              </Button>
            </div>
          </div>
          <div
            className="relative flex-1 overflow-hidden"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
            onDoubleClick={handleDoubleClick}
            style={{ touchAction: zoom > MIN_ZOOM ? "none" : "pan-y" }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.2s ease",
                cursor: zoom > MIN_ZOOM ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
            >
              <Image
                src={activeSources.primary}
                alt={activeAlt}
                fill
                className="select-none object-contain"
                priority
                draggable={false}
                placeholder="blur"
                blurDataURL={FALLBACK_BLUR_DATA_URL}
                sizes="100vw"
                onError={createOnErrorHandler(activeSources.fallback)}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 overflow-x-auto">
            {items.map((photo, index) => {
              const isActive = index === activeIndex;
              const sources = buildImageSources(photo.url);
              return (
                <button
                  key={photo.id ?? `${photo.url}-lightbox-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-2xl border ${isActive ? "border-brand bg-brand/20" : "border-white/20 bg-white/10"} p-1 transition hover:border-brand`}
                  aria-label={`Afficher la photo ${index + 1}`}
                >
                  <span className="relative block h-16 w-24 overflow-hidden rounded-xl">
                    <Image
                      src={sources.primary}
                      alt={photo.label ?? vehicleName}
                      fill
                      className="object-cover"
                      loading={index === activeIndex ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL={FALLBACK_BLUR_DATA_URL}
                      sizes="120px"
                      onError={createOnErrorHandler(sources.fallback)}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          {activePhoto?.label ? (
            <p className="mt-3 text-center text-sm text-white/80">{activePhoto?.label}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
