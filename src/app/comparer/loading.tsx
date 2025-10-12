import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10 py-16">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
        <Skeleton className="h-12 w-2/3 rounded-full" />
        <Skeleton className="h-8 w-1/2 rounded-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  );
}
