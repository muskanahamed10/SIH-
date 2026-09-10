import Link from "next/link";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { GovHeader } from "@/components/layout/gov-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ShieldCheck, ArrowRight, BookOpen, Target, Sparkles, Award } from "lucide-react";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const commonT = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex-1 flex flex-col">
      <GovHeader />

      <main className="flex-1">
        {/* Karmayogi Module Welcome Hero */}
        <section className="bg-gradient-to-b from-[#0B2545] via-[#0E2F5A] to-[#134074] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-blue-900 min-h-[320px] sm:min-h-[350px] flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t("heroEyebrow")}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
              {t("heroTitle")}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-blue-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* Distinct, High-Contrast Action Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-3.5 pt-3">
              {/* PRIMARY CTA: Explore My Competency */}
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md hover:shadow-lg transition-all gap-2 h-11 px-6 text-sm sm:text-base">
                <Link href={`/${locale}/learner/competency`}>
                  <Target className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>{t("exploreCompetencyCta")}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>
              </Button>

              {/* SECONDARY CTA: Browse Learning Catalog (Strong visible contrast against navy background) */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-slate-900/80 hover:bg-slate-900 text-white border-2 border-slate-300/80 hover:border-white shadow-sm hover:shadow transition-all font-semibold gap-2.5 h-11 px-6 text-sm sm:text-base backdrop-blur-xs focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Link href={`/${locale}/explore`}>
                  <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{t("browseCatalogCta")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Subtle Entry Point: Build Your Competency Profile with 3 Compact Steps */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#0B2545] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-700/60 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[160px]">
            <div className="space-y-4 max-w-2xl w-full">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("calloutBadge")}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {t("calloutTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
                  {t("calloutDesc")}
                </p>
              </div>

              {/* 3 Compact Steps Sequence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Step 01 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-500/30">
                  <span className="text-amber-400 font-extrabold text-xs tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    {t("steps.step1Num")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{t("steps.step1Title")}</p>
                    <p className="text-[10px] text-blue-200/70 truncate">{t("steps.step1Desc")}</p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-500/30">
                  <span className="text-amber-400 font-extrabold text-xs tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    {t("steps.step2Num")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{t("steps.step2Title")}</p>
                    <p className="text-[10px] text-blue-200/70 truncate">{t("steps.step2Desc")}</p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-900/40 border border-blue-500/30">
                  <span className="text-amber-400 font-extrabold text-xs tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    {t("steps.step3Num")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{t("steps.step3Title")}</p>
                    <p className="text-[10px] text-blue-200/70 truncate">{t("steps.step3Desc")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Clear Callout CTA: Start Baseline Assessment */}
            <div className="shrink-0 w-full lg:w-auto flex flex-col items-center lg:items-end gap-2">
              <Button asChild size="lg" className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 shadow-md gap-2 h-12 text-sm sm:text-base">
                <Link href={`/${locale}/learner/assessment`}>
                  <span>{t("startBaselineCta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <span className="text-[11px] text-blue-200/70 font-medium text-center lg:text-right">
                15 mins • Official Subordinate Statistical Service benchmark
              </span>
            </div>
          </div>
        </section>

        {/* Transparent iGOT Alignment & Platform Governance Notice */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-slate-700 text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="font-semibold text-slate-900">
                {t("igotAttribution")}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-blue-900 text-[11px] font-medium shadow-2xs">
              <span>{t("catalogDemoBadge")}</span>
            </div>
          </div>
        </section>

        {/* Portals Selection */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learner Card */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-200 border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gov" className="gap-1">
                    <UserCheck className="w-3 h-3 text-blue-800" />
                    {t("learnerCard.badge")}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {t("learnerCard.cadreRoles")}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
                  {t("learnerCard.title")}
                </CardTitle>
                <CardDescription>
                  {t("learnerCard.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                  <span>
                    {t("learnerCard.feature1Prefix")}{" "}
                    <strong>{t("learnerCard.feature1Bold")}</strong>{" "}
                    {t("learnerCard.feature1Suffix")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    {t("learnerCard.feature2Prefix")}{" "}
                    <strong>{t("learnerCard.feature2Bold")}</strong>{" "}
                    {t("learnerCard.feature2Suffix")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    {t("learnerCard.feature3Prefix")}{" "}
                    <strong>{t("learnerCard.feature3Bold")}</strong>{" "}
                    {t("learnerCard.feature3Suffix")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild className="w-full bg-[#0B2545] hover:bg-[#134074] text-white font-semibold">
                  <Link href={`/${locale}/learner/dashboard`}>
                    {t("learnerCard.cta")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Admin Card */}
            <Card className="shadow-md hover:shadow-xl transition-shadow duration-200 border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" className="gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-800" />
                    {t("adminCard.badge")}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {t("adminCard.cadreRoles")}
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
                  {t("adminCard.title")}
                </CardTitle>
                <CardDescription>
                  {t("adminCard.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-indigo-700 mt-0.5 shrink-0" />
                  <span>
                    {t("adminCard.feature1Prefix")}{" "}
                    <strong>{t("adminCard.feature1Bold")}</strong>{" "}
                    {t("adminCard.feature1Suffix")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>
                    {t("adminCard.feature2Prefix")}{" "}
                    <strong>{t("adminCard.feature2Bold")}</strong>{" "}
                    {t("adminCard.feature2Suffix")}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                  <span>
                    {t("adminCard.feature3Prefix")}{" "}
                    <strong>{t("adminCard.feature3Bold")}</strong>{" "}
                    {t("adminCard.feature3Suffix")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="outline" className="w-full border-slate-300 hover:bg-slate-100 font-semibold text-slate-800">
                  <Link href={`/${locale}/admin/dashboard`}>
                    {t("adminCard.cta")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>{commonT("footer.copyright")}</p>
          <p className="mt-1 text-slate-400">{commonT("footer.generalNotice")}</p>
        </div>
      </footer>
    </div>
  );
}
