"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";

type SignedUploadResponse = {
  bucket: string;
  path: string;
  signedUrl: string;
  publicUrl: string;
  token: string;
  expiresIn: number;
};

type UploadState = {
  step: "idle" | "signing" | "uploading" | "done" | "error";
  message?: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return "Une erreur inattendue s'est produite.";
}

export function UploadDemo(): JSX.Element {
  const [folder, setFolder] = useState("vehicles");
  const [state, setState] = useState<UploadState>({ step: "idle" });
  const [result, setResult] = useState<SignedUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setState({ step: "idle" });
  }, []);

  const handleFileSelect = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      event.target.value = "";

      try {
        setResult(null);
        setState({ step: "signing", message: "Génération de l'URL signée..." });

        const payload = {
          filename: file.name,
          contentType: file.type || "application/octet-stream",
          folder: folder.trim() || undefined,
        };

        const signResponse = await fetch("/api/uploads/sign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!signResponse.ok) {
          const errorBody = await signResponse.json().catch(() => ({}));
          const apiMessage =
            typeof errorBody?.error === "string"
              ? errorBody.error
              : `HTTP ${signResponse.status}`;
          throw new Error(
            `Impossible de créer l'upload: ${apiMessage}. Vérifiez la configuration Supabase.`,
          );
        }

        const signedResult: SignedUploadResponse = await signResponse.json();

        setState({ step: "uploading", message: "Upload sur Supabase..." });

        const uploadResponse = await fetch(signedResult.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-upsert": "true",
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          const uploadBody = await uploadResponse.text();
          throw new Error(
            `Upload Supabase échoué (${uploadResponse.status}): ${uploadBody || "raison inconnue"}`,
          );
        }

        setResult(signedResult);
        setState({
          step: "done",
          message: "Upload réussi !",
        });
      } catch (error) {
        setState({
          step: "error",
          message: getErrorMessage(error),
        });
      }
    },
    [folder],
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
          disabled={state.step === "signing" || state.step === "uploading"}
        >
          {state.step === "signing" || state.step === "uploading"
            ? "Upload en cours..."
            : "Choisir un fichier"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          disabled={state.step === "signing" || state.step === "uploading"}
        >
          Réinitialiser
        </button>
      </div>

      {state.message ? (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            state.step === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : state.step === "done"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-border bg-muted/30 text-muted-foreground"
          }`}
        >
          {state.message}
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
