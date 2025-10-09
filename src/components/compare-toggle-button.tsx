"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCompare } from "@/components/compare-context";
import { cn } from "@/lib/utils";

interface CompareToggleButtonProps {
  vehicleId: string;
  children?: ReactNode;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function CompareToggleButton({
  vehicleId,
  children,
  size = "default",
  className,
}: CompareToggleButtonProps): JSX.Element {
  const { addVehicle, removeVehicle, isSelected, canAddMore } = useCompare();
  const selected = isSelected(vehicleId);

  const handleClick = () => {
    if (selected) {
      removeVehicle(vehicleId);
    } else if (canAddMore) {
      addVehicle(vehicleId);
    }
  };

  return (
    <Button
      size={size}
      variant={selected ? "secondary" : "outline"}
      onClick={handleClick}
      disabled={!selected && !canAddMore}
      className={cn(className)}
    >
      {children ?? (selected ? "Retirer du comparateur" : "Ajouter au comparateur")}
    </Button>
  );
}
