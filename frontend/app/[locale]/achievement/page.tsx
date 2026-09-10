"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Award, ShieldCheck, Calendar, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AchievementPage() {
  const t = useTranslations("achievement");
  const locale = useLocale();

  const credentials = [
    {
      id: "cred-1",
      title: "Survey Sampling Design & Estimation Standards",
      issuingAuthority: "National Statistical Systems Training Academy (NSSTA)",
      dateIssued: "15 Aug 2026",
      credentialId: "NSSTA-2026-STAT-8841",
      competency: "Survey Methodology",
      grade: "Level 4 Mastery",
    },
    {
      id: "cred-2",
      title: "Annual Cadre Baseline Diagnostic Certification",
      issuingAuthority: "Cadre Review Cell • MoSPI",
      dateIssued: "15 Aug 2026",
      credentialId: "MOSPI-SSS-BASE-8841",
      competency: "Overall Cadre Benchmark",
      grade: "Demonstrated 68%",
    },
    {
      id: "cred-3",
      title: "Official Statistics & SNA 2008 Foundations",
      issuingAuthority: "iGOT Karmayogi Accredited Module",
      dateIssued: "10 Jul 2026",
      credentialId: "IGOT-SNA-2026-4412",
      competency: "Official Standards",
      grade: "Level 3 Competence",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" aria-hidden="true" />
          <span>{t("title")}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {credentials.map((cred) => (
          <Card key={cred.id} className="p-5 shadow-xs border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-900 border-amber-300">
                  {cred.competency}
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                  {cred.grade}
                </Badge>
              </div>

              <h2 className="font-bold text-base text-slate-900 leading-snug">
                {cred.title}
              </h2>

              <p className="text-xs text-slate-600 font-medium">
                {cred.issuingAuthority}
              </p>

              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <p className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Issued: {cred.dateIssued}</span>
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  ID: {cred.credentialId}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 text-blue-900 border-blue-200 hover:bg-blue-50"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Download Credential</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-800 shrink-0" aria-hidden="true" />
          <span>All competency certificates are cryptographically verifiable and synchronized with the iGOT Karmayogi National Digital Credential registry.</span>
        </div>
        <Link href={`/${locale}/learner/competency`}>
          <Button size="sm" className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-semibold shrink-0">
            View My Competency
          </Button>
        </Link>
      </div>
    </div>
  );
}
