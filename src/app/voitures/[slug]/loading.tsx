import { Skeleton } from "@/components/ui/skeleton";
import { VehicleCardSkeleton } from "@/components/vehicle-card-skeleton";

export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="h-[420px] w-full bg-muted/40">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end gap-4 px-6 py-12">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-2/3 rounded-full" />
          <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
      </section>
      <main className="flex flex-1 flex-col bg-muted/20 py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6">
            <Skeleton className="h-[320px] w-full rounded-3xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          </section>
          <aside className="space-y-6">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <VehicleCardSkeleton />
          </aside>
        </div>
      </main>
    </div>
  );
}
