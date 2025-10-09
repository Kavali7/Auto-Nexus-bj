import { Skeleton } from "@/components/ui/skeleton";

export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <Skeleton className="h-12 w-2/3 rounded-full" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
