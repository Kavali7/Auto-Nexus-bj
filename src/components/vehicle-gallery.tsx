"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

export function VehicleGallery({
  items,
  fallbackImage,
  vehicleName,
}: VehicleGalleryProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const hasGallery = items.length > 0;
  const [primary, secondary] = useMemo(() => {
    if (!hasGallery) {
      return [null, [] as VehicleGalleryItem[]];
    }

    const [first, ...rest] = items;
    return [first, rest];
  }, [hasGallery, items]);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);
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
  }, [activeIndex, showNext, showPrevious]);

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
              src={fallbackImage}
              alt={vehicleName}
              fill
              className="object-cover"
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
            src={primary.url}
            alt={primary.label ?? vehicleName}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            priority
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
            return (
              <button
                key={photo.id ?? `${photo.url}-${index}`}
                type="button"
                className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted"
                onClick={() => openLightbox(absoluteIndex)}
                aria-label="Ouvrir la photo en plein ecran"
              >
                <Image
                  src={photo.url}
                  alt={photo.label ?? vehicleName}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
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

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 text-white"
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.18em]">
              Galerie media ({activeIndex + 1}/{items.length})
            </p>
            <div className="flex items-center gap-2">
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
          <div className="relative flex-1">
            <Image
              src={items[activeIndex]?.url ?? fallbackImage}
              alt={items[activeIndex]?.label ?? vehicleName}
              fill
              className="object-contain"
              priority
            />
          </div>
          {items[activeIndex]?.label ? (
            <p className="mt-3 text-center text-sm text-white/80">
              {items[activeIndex]?.label}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
