"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles, Clock, Globe2, ArrowRight, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecommendationItem } from "@/types";

interface AiRecommendationsProps {
  recommendations: RecommendationItem[];
}

export function AiRecommendations({ recommendations }: AiRecommendationsProps) {
  const t = useTranslations("dashboard.recommendations");
  const commonT = useTranslations("dashboard");
  const locale = useLocale();

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-8 text-center space-y-3 border-slate-200 shadow-xs">
        <Sparkles className="w-8 h-8 text-amber-500 mx-auto" aria-hidden="true" />
        <h3 className="font-bold text-base text-slate-900">{t("emptyTitle")}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{t("emptyDesc")}</p>
        <Link href={`/${locale}/learner/resources`}>
          <Button variant="outline" size="sm" className="mt-2 text-xs font-semibold">
            Browse All Resources
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
            <span>{t("title")}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="bg-white text-blue-900 border-blue-200 font-semibold px-2.5 py-1 text-[11px]">
            iGOT Karmayogi Synced
          </Badge>
          <Link href={`/${locale}/learner/recommendations`}>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-900 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1">
              <span>View Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className="p-5 shadow-xs border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <Badge variant="secondary" className="font-semibold text-[10px] bg-blue-100 text-blue-900 border-none">
                  {rec.competency}
                </Badge>
                <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>{rec.duration}</span>
                </span>
              </div>

              {/* Explicit Karmayogi Integration Indicator */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-semibold">
                <Sparkles className="w-3 h-3 text-amber-600" aria-hidden="true" />
                <span>Recommended for your competency gap</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                {rec.title}
              </h3>

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Level: {rec.difficulty}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>Source: <strong className="text-blue-900 font-semibold">{rec.source}</strong></span>
                </span>
              </div>

              {/* Explainable AI Reason */}
              <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-100 text-xs text-blue-950 space-y-1">
                <p className="font-bold text-blue-900 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
                  <span>{t("aiReason")}</span>
                </p>
                <p className="text-[11px] leading-relaxed">
                  {rec.reason}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Link href={`/${locale}/learner/resources/${rec.resourceId || "rec-stat-model-101"}`}>
                <Button className="w-full bg-[#0B2545] hover:bg-[#134074] text-white py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs">
                  <span>{t("startLearning")}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Official AI Advisory Disclaimer */}
      <div className="p-3 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          {commonT("aiDisclaimer")}
        </p>
      </div>
    </section>
  );
}
