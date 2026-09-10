"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useResourceDetail } from "@/hooks/use-queries";
import { ResourceDetailView } from "@/components/learner/recommendations/resource-detail-view";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ResourcePreviewPage() {
  const params = useParams();
  const locale = useLocale();
  const resourceId = (params?.resourceId as string) || "rec-stat-model-101";
  const { data, isLoading, isError } = useResourceDetail(resourceId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-sm text-slate-500 animate-pulse space-y-4">
        <div className="h-40 bg-slate-100 rounded-2xl max-w-xl mx-auto" />
        <p>Loading course preview from iGOT Karmayogi catalog...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 my-12">
        <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Resource not found</h2>
          <p className="text-xs text-slate-500">The requested learning resource could not be found in the catalog.</p>
        </div>
        <Link href={`/${locale}/learner/recommendations`}>
          <Button className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Recommendations</span>
          </Button>
        </Link>
      </div>
    );
  }

  return <ResourceDetailView resource={data} />;
}
