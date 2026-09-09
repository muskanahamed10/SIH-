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
        <section className="bg-gradient-to-b from-[#0B2545] to-[#134074] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900 min-h-[280px] sm:min-h-[310px] flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("heroBadge")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {t("heroTitle")}
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="default" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md gap-2">
                <Link href={`/${locale}/learner/competency`}>
                  <span>{t("exploreCompetencyCta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="default" variant="outline" className="border-blue-300 text-white hover:bg-blue-800/60 gap-2">
                <Link href={`/${locale}/explore`}>
                  <BookOpen className="w-4 h-4" />
                  <span>{t("browseCatalogCta")}</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Subtle Entry Point: Build Your Competency Profile */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B2545] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-700/60 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[140px]">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("calloutBadge")}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t("calloutTitle")}
              </h2>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                {t("calloutDesc")}
              </p>
            </div>
            <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 shrink-0 shadow-md">
              <Link href={`/${locale}/learner/competency`} className="flex items-center gap-1.5">
                <span>{t("discoverCompetencyCta")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Portals Selection */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
