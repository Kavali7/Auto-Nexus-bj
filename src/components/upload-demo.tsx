"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";

import { useSignedUpload } from "@/hooks/use-signed-upload";

export function UploadDemo(): JSX.Element {
  const [folder, setFolder] = useState("vehicles");
  const { result, state, uploadFile, reset, isUploading } = useSignedUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      event.target.value = "";

      try {
        await uploadFile(file, {
          folder: folder.trim() || undefined,
          contentType: file.type || "application/octet-stream",
        });
      } catch {
        // L'état d'erreur est géré par le hook, rien à faire ici.
      }
    },
    [folder, uploadFile],
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="space-y-2">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Dossier Supabase
          <input
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            className="h-11 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm"
            placeholder="vehicles"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <p className="text-sm text-muted-foreground">
          Sélectionnez une image pour générer une URL signée via Supabase Storage,
          puis uploader le fichier directement depuis le navigateur.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleButtonClick}
          className="inline-flex h-11 items-center justify-center rounded-md border border-transparent bg-brand px-4 text-sm font-medium text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          disabled={isUploading}
        >
          {isUploading ? "Upload en cours..." : "Choisir un fichier"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          disabled={isUploading}
        >
          Réinitialiser
        </button>
      </div>

      {state.message || state.error ? (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            state.status === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : state.status === "done"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-border bg-muted/30 text-muted-foreground"
          }`}
        >
          {state.error ?? state.message}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-4 text-sm">
          <div>
            <span className="font-semibold text-foreground">URL publique</span>
            <p className="break-all text-muted-foreground">{result.publicUrl}</p>
          </div>
          <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Bucket:</span>{" "}
              {result.bucket}
            </div>
            <div>
              <span className="font-medium text-foreground">Chemin:</span>{" "}
              {result.path}
            </div>
            <div>
              <span className="font-medium text-foreground">Expire dans:</span>{" "}
              {result.expiresIn}s
            </div>
            <div>
              <span className="font-medium text-foreground">Token:</span>{" "}
              <span className="break-all">{result.token}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

