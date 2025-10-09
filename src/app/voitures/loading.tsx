import { VehicleCardSkeleton } from "@/components/vehicle-card-skeleton";

export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
        <div className="space-y-4">
          <div className="h-4 w-40 rounded-full bg-muted" />
          <div className="h-10 w-2/3 rounded-full bg-muted" />
          <div className="h-4 w-full rounded-full bg-muted" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
