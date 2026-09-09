"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Brain, Award, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CompetencyEmpty() {
  const t = useTranslations("myCompetency.empty");
  const locale = useLocale();

  return (
    <Card className="p-12 text-center border-slate-200 bg-white space-y-5 max-w-xl mx-auto my-10 shadow-xs">
      <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200">
        <Brain className="w-10 h-10 text-blue-800" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          {t("description")}
        </p>
      </div>

      <div className="pt-2">
        <Link href={`/${locale}/learner/assessment`}>
          <Button className="bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-sm px-6 py-2.5 gap-2 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
