import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-busy="true" aria-label="Loading competency dashboard">
      {/* Header Skeleton */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
        <Skeleton className="h-8 w-72 rounded-md" />
        <Skeleton className="h-4 w-96 rounded-md" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      {/* Radar & Priority Gaps Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-7 h-96 rounded-xl" />
        <Skeleton className="lg:col-span-5 h-96 rounded-xl" />
      </div>

      {/* Recommendations Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>

      {/* Learning Path Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-44 rounded-xl" />
        </div>
      </div>

      {/* Recent Assessment & Quick Actions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-6 h-64 rounded-xl" />
        <Skeleton className="lg:col-span-6 h-64 rounded-xl" />
      </div>
    </div>
  );
}
