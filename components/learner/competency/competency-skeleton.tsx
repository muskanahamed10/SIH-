import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CompetencySkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading Competency Profile">
      {/* Header Skeleton */}
      <Card className="p-6 sm:p-8 border-slate-200 space-y-3">
        <Skeleton className="h-5 w-48 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-6 w-40 rounded" />
        </div>
      </Card>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 border-slate-200 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-36" />
          </Card>
        ))}
      </div>

      {/* GapRadar & Priority Gaps Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-6 border-slate-200 h-96 flex flex-col justify-between">
            <Skeleton className="h-6 w-48" />
            <div className="flex-1 flex items-center justify-center">
              <Skeleton className="h-64 w-64 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </Card>
        </div>
        <div className="lg:col-span-5">
          <Card className="p-6 border-slate-200 h-96 space-y-4">
            <Skeleton className="h-6 w-44" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-lg space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <Card className="p-6 border-slate-200 space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-xl space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
