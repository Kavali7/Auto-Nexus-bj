import type { Metadata } from "next";

import { ComparePageContent } from "@/components/compare-page-content";

export const metadata: Metadata = {
  title: "Comparateur Auto Nexus BJ",
  description:
    "Sélectionnez jusqu'à 4 véhicules et visualisez le tableau comparatif statique Auto Nexus BJ.",
};

export default function ComparePage(): JSX.Element {
  return <ComparePageContent />;
}
