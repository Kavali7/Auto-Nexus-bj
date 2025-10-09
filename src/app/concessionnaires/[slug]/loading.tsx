import { Skeleton } from "@/components/ui/skeleton";
import { VehicleCardSkeleton } from "@/components/vehicle-card-skeleton";

export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <section className="h-[360px] w-full bg-muted/40">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-end gap-4 px-6 py-10">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-12 w-1/2 rounded-full" />
          <Skeleton className="h-4 w-1/3 rounded-full" />
        </div>
      </section>
      <main className="flex flex-1 flex-col py-12">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <VehicleCardSkeleton key={index} />
              ))}
            </div>
          </section>
          <aside className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </aside>
        </div>
      </main>
    </div>
  );
}
