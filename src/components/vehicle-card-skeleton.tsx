import { Skeleton } from "@/components/ui/skeleton";

export function VehicleCardSkeleton(): JSX.Element {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white/80">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="flex gap-3 border-t border-border/70 bg-muted/30 p-4">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  );
}
