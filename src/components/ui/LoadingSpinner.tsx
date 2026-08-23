import { cn } from "@/lib/cn";

interface LoadingSpinnerProps {
  /** Centers the spinner in the viewport instead of a page section. */
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ fullScreen, className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "min-h-screen" : "min-h-64",
        className
      )}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
}
