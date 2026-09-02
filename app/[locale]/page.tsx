import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("common");

  return (
    <div className="flex-1 flex flex-col">
      <GovHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0B2545] to-[#134074] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Smart India Hackathon 2026 • Problem Statement 101
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {t("appTitle")}
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto font-normal leading-relaxed">
              {t("appSubtitle")} — empowering officers across the Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) with targeted competency diagnostics, GapRadar analytics, and curated iGOT Karmayogi learning pathways.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg gap-2">
                <Link href={`/${locale}/learner/dashboard`}>
                  <span>Access Learner Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-300 text-white hover:bg-blue-800/60 gap-2">
                <Link href={`/${locale}/admin/dashboard`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin & SME Portal</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Portals Selection */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learner Card */}
            <Card className="shadow-md hover:shadow-xl transition-all border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gov" className="gap-1">
                    <UserCheck className="w-3 h-3 text-blue-800" />
                    Official Cadre Member (M1)
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">SSO / JSO / AD</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
                  Learner Competency Workspace
                </CardTitle>
                <CardDescription>
                  Diagnose current competency levels against your target role requirements, visualize skill gaps with GapRadar, and pursue iGOT Karmayogi learning paths.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                  <span>Interactive <strong>GapRadar</strong> multi-dimensional role benchmark</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Timed <strong>Competency Assessments</strong> with domain evaluation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>Integrated <strong>iGOT Karmayogi</strong> courses & personalized timelines</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild className="w-full bg-[#0B2545] hover:bg-[#134074] text-white font-semibold">
                  <Link href={`/${locale}/learner/dashboard`}>
                    Enter Learner Portal
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Admin Card */}
            <Card className="shadow-md hover:shadow-xl transition-all border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" className="gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-800" />
                    Administrator & SME (M2)
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">MoSPI / NSSTA</span>
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mt-2">
                  Competency Admin & Governance
                </CardTitle>
                <CardDescription>
                  Maintain national statistical competency matrices, map cadre requirements, review AI-generated questions, and monitor department-wide heatmaps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <Target className="w-4 h-4 text-indigo-700 mt-0.5 shrink-0" />
                  <span>Cadre <strong>Role-to-Competency Mapping</strong> matrix</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>AI-Generated <strong>MCQ Subject Matter Expert Review</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                  <span>Departmental <strong>Competency Heatmaps</strong> & Analytics</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild variant="outline" className="w-full border-slate-300 hover:bg-slate-100 font-semibold text-slate-800">
                  <Link href={`/${locale}/admin/dashboard`}>
                    Enter Admin Portal
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
          <p>© 2026 Ministry of Statistics and Programme Implementation (MoSPI) • Government of India</p>
          <p className="mt-1 text-slate-400">Integrated with iGOT Karmayogi National Capacity Building Framework</p>
        </div>
      </footer>
    </div>
  );
}
