import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

export interface LoadingStateProps {
  label?: string;
  variant?: "spinner" | "cards" | "table";
  count?: number;
  className?: string;
}

export function LoadingState({
  label = "Loading information...",
  variant = "spinner",
  count = 3,
  className,
}: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
        aria-busy="true"
        aria-label={label}
        role="status"
      >
        <span className="sr-only">{label}</span>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="p-5 rounded-xl border border-slate-200 bg-white space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-28 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-16 w-full rounded" />
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div
        className={cn("w-full rounded-xl border border-slate-200 bg-white p-4 space-y-3", className)}
        aria-busy="true"
        aria-label={label}
        role="status"
      >
        <span className="sr-only">{label}</span>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 py-2">
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center text-slate-500",
        className
      )}
      aria-busy="true"
      role="status"
    >
      <Loader2 className="w-8 h-8 animate-spin text-blue-900 mb-3" aria-hidden="true" />
      <p className="text-xs sm:text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
