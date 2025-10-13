"use client";

import { useCallback, useRef } from "react";

import { isStaticDemoMode, type DemoAction } from "@/lib/demo";

const demoMessages: Record<DemoAction, string> = {
  analytics:
    "Mode démo : les évènements analytics sont simulés. Aucun enregistrement réel n'est déclenché.",
  favorites:
    "Mode démo : la sauvegarde favoris/comparateur est simulée. Vos sélections ne sont pas persistées côté serveur.",
  uploads:
    "Mode démo : l'upload de médias est en lecture seule. Branchez Supabase Storage pour activer l'envoi.",
};

export function useDemoNotice(): (action: DemoAction) => void {
  const shownRef = useRef<Record<DemoAction, boolean>>({
    analytics: false,
    favorites: false,
    uploads: false,
  });

  return useCallback((action: DemoAction) => {
    if (!isStaticDemoMode) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    if (shownRef.current[action]) {
      return;
    }

    shownRef.current[action] = true;
    window.alert(demoMessages[action]);
  }, []);
}
