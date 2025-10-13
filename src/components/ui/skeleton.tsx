import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  pulse?: boolean;
}

export function Skeleton({
  className,
  pulse = true,
  ...props
}: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn("rounded-md bg-muted", pulse && "animate-pulse", className)}
      {...props}
    />
  );
}
