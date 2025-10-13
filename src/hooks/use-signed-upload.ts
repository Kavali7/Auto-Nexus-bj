"use client";

import { useCallback, useState } from "react";

import { isStaticDemoMode } from "@/lib/demo";

export type SignedUploadResponse = {
  bucket: string;
  path: string;
  signedUrl: string;
  uploadUrl: string;
  uploadHeaders: Record<string, string>;
  publicUrl: string;
  token: string;
  expiresIn: number;
  expiresAt: string;
};

export type UploadStatus = "idle" | "signing" | "uploading" | "done" | "error";

export type UploadState = {
  status: UploadStatus;
  message?: string;
  error?: string;
};

export type UploadOptions = {
  folder?: string;
  contentType?: string;
  upsert?: boolean;
  expiresIn?: number;
};

const DEMO_UPLOAD_MESSAGE =
  "Fonctionnalité à venir : l'upload signé sera activé après la connexion Supabase.";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return "Une erreur inattendue s'est produite.";
}

export function useSignedUpload(defaultOptions: UploadOptions = {}): {
  state: UploadState;
  result: SignedUploadResponse | null;
  uploadFile: (
    file: File | Blob,
    options?: UploadOptions,
  ) => Promise<SignedUploadResponse>;
  reset: () => void;
  isUploading: boolean;
} {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [result, setResult] = useState<SignedUploadResponse | null>(null);

  const reset = useCallback(() => {
    setState({ status: "idle" });
    setResult(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File | Blob, overrides: UploadOptions = {}) => {
      const mergedOptions = {
        ...defaultOptions,
        ...overrides,
      };

      const filename =
        file instanceof File && file.name
          ? file.name
          : `asset-${Date.now()}.${
              (mergedOptions.contentType ?? "bin").split("/").pop() ?? "bin"
            }`;

      const contentType =
        mergedOptions.contentType ||
        (file instanceof File && file.type ? file.type : "application/octet-stream");

      if (isStaticDemoMode) {
        setState({ status: "idle", message: DEMO_UPLOAD_MESSAGE });
        throw new Error(DEMO_UPLOAD_MESSAGE);
      }

      setState({
        status: "signing",
        message: "Génération de l'URL signée…",
      });
      setResult(null);

      const signResponse = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          contentType,
          folder: mergedOptions.folder,
          expiresIn: mergedOptions.expiresIn,
          upsert: mergedOptions.upsert,
        }),
      });

      const hasJson =
        signResponse.headers
          .get("content-type")
          ?.toLowerCase()
          .includes("application/json") ?? false;
      const responseBody = hasJson ? await signResponse.json().catch(() => null) : null;

      if (signResponse.status === 204 || (responseBody as { demo?: boolean })?.demo) {
        const message =
          (responseBody as { message?: string })?.message ?? DEMO_UPLOAD_MESSAGE;
        setState({ status: "idle", message });
        throw new Error(message);
      }

      if (!signResponse.ok) {
        const apiMessage =
          typeof (responseBody as { error?: string })?.error === "string"
            ? (responseBody as { error: string }).error
            : `HTTP ${signResponse.status}`;

        setState({
          status: "error",
          error: `Impossible de créer l'upload signé : ${apiMessage}`,
        });

        throw new Error(`Erreur API upload : ${apiMessage}`);
      }

      const signedPayload = responseBody as SignedUploadResponse;

      setState({
        status: "uploading",
        message: "Upload vers Supabase en cours…",
      });

      const uploadResponse = await fetch(
        signedPayload.uploadUrl || signedPayload.signedUrl,
        {
          method: "PUT",
          headers: {
            ...signedPayload.uploadHeaders,
            "Content-Type": contentType,
          },
          body: file,
        },
      );

      if (!uploadResponse.ok) {
        const uploadBody = await uploadResponse.text();
        const errorMessage = `Upload Supabase échoué (${uploadResponse.status}) : ${
          uploadBody || "raison inconnue"
        }`;

        setState({
          status: "error",
          error: errorMessage,
        });

        throw new Error(errorMessage);
      }

      setResult(signedPayload);
      setState({
        status: "done",
        message: "Upload réussi !",
      });

      return signedPayload;
    },
    [defaultOptions],
  );

  return {
    state,
    result,
    uploadFile: async (file, options) => {
      try {
        return await uploadFile(file, options);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    reset,
    isUploading: state.status === "signing" || state.status === "uploading",
  };
}
