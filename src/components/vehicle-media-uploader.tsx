"use client";

/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent } from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import { type SignedUploadResponse, useSignedUpload } from "@/hooks/use-signed-upload";

type GalleryItem = SignedUploadResponse & {
  originalName: string;
};

export function VehicleMediaUploader(): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [vehicleName, setVehicleName] = useState("");
  const [notes, setNotes] = useState("");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const { uploadFile, state, isUploading, reset } = useSignedUpload({
    folder: "vehicles",
  });

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      event.target.value = "";
      setFormMessage(null);

      try {
        const uploaded = await uploadFile(file, {
          folder: "vehicles",
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

        setGallery((current) => [
          {
            ...uploaded,
            originalName: file.name,
          },
          ...current,
        ]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error ?? "");
        setFormMessage(
          message || "Impossible d'uploader le fichier. Vérifiez la console.",
        );
      }
    },
    [uploadFile],
  );

  const handleRemove = useCallback((path: string) => {
    setGallery((current) => current.filter((item) => item.path !== path));
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setGallery([]);
    setFormMessage(null);
  }, [reset]);

  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          title: vehicleName || "Nouvelle annonce",
          notes: notes || undefined,
          media: gallery.map((item) => ({
            originalName: item.originalName,
            publicUrl: item.publicUrl,
            bucket: item.bucket,
            path: item.path,
          })),
        },
        null,
        2,
      ),
    [vehicleName, notes, gallery],
  );

  const consolidatedMessage = formMessage ?? state.error ?? state.message ?? undefined;

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,280px)]">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {"Nom de l'annonce"}
          <input
            value={vehicleName}
            onChange={(event) => setVehicleName(event.target.value)}
            placeholder="Toyota Hilux Confort 4x4"
            className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Notes internes
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Shooting prévu jeudi 14h, prévoir visuels 360°"
            className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-xl border border-dashed border-muted-foreground/40 bg-muted/10 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleBrowse}
            className="inline-flex h-11 items-center justify-center rounded-md border border-transparent bg-brand px-4 text-sm font-medium text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
            disabled={isUploading}
          >
            {isUploading ? "Upload en cours..." : "Ajouter un visuel"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
            disabled={isUploading || gallery.length === 0}
          >
            Réinitialiser la sélection
          </button>
          <p className="text-sm text-muted-foreground">
            Chaque image passe par `/api/uploads/sign` puis est uploadée sur Supabase
            Storage.
          </p>
        </div>

        {consolidatedMessage ? (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              state.status === "error" || formMessage
                ? "border-red-200 bg-red-50 text-red-700"
                : state.status === "done"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-border bg-muted/30 text-muted-foreground"
            }`}
          >
            {consolidatedMessage}
          </div>
        ) : null}

        {gallery.length > 0 ? (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <div
                  key={item.path}
                  className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm"
                >
                  <img
                    src={item.publicUrl}
                    alt={item.originalName}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="space-y-1 border-t border-border bg-muted/20 p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{item.originalName}</p>
                    <p className="break-all">{item.path.replace(/^vehicles\//, "")}</p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.path)}
                      className="inline-flex items-center text-[11px] font-medium text-brand underline-offset-2 hover:underline"
                    >
                      Retirer du lot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucune image sélectionnée pour le moment.
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Payload prêt à persister (Prisma / Supabase)
        </p>
        <pre className="max-h-60 overflow-auto rounded-md bg-gray-950/95 px-3 py-2 text-xs text-gray-100">
          <code>{payloadPreview}</code>
        </pre>
        <p className="text-xs text-muted-foreground">
          Branchez ce payload sur votre mutation Prisma (ex: `Vehicle.create`) en stockant
          `path` et `publicUrl` pour alimenter les galeries front.
        </p>
      </div>
    </div>
  );
}
