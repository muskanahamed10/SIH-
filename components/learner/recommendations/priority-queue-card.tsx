"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ListOrdered, ArrowRight, Clock, Milestone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QueueItem {
  timing: "NOW" | "NEXT" | "LATER";
  orderNumber: number;
  resourceId: string;
  title: string;
  competencyName: string;
}

interface PriorityQueueCardProps {
  orderQueue: QueueItem[];
}

export function PriorityQueueCard({ orderQueue }: PriorityQueueCardProps) {
  const t = useTranslations("learningRecommendations.priorityQueue");
  const locale = useLocale();

  const getTimingBadge = (timing: "NOW" | "NEXT" | "LATER") => {
    switch (timing) {
      case "NOW":
        return <Badge className="bg-emerald-700 text-white font-extrabold text-[10px] px-2">{t("now")}</Badge>;
      case "NEXT":
        return <Badge className="bg-blue-800 text-white font-bold text-[10px] px-2">{t("next")}</Badge>;
      case "LATER":
        return <Badge className="bg-slate-500 text-white font-medium text-[10px] px-2">{t("later")}</Badge>;
    }
  };

  return (
    <Card className="p-6 sm:p-7 shadow-xs border-slate-200 bg-white space-y-4">
      <div className="pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        <Link href={`/${locale}/learner/learning-path`}>
          <Button variant="outline" size="sm" className="text-xs font-semibold self-start sm:self-auto border-blue-200 text-blue-900 hover:bg-blue-50 gap-1.5">
            <Milestone className="w-3.5 h-3.5 text-blue-700" />
            <span>{t("viewFullLearningPath")}</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {orderQueue.map((item) => (
          <Link
            key={item.resourceId}
            href={`/${locale}/learner/resources/${item.resourceId}`}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400">Step {item.orderNumber}</span>
              {getTimingBadge(item.timing)}
            </div>

            <div className="space-y-1">
              <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                {item.title}
              </p>
              <span className="text-[11px] text-slate-500 block font-medium">
                {item.competencyName}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-blue-800 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Start next</span>
              </span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
