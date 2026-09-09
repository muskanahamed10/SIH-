"use client";

import { useLearnerProfile } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, BookOpen, Flame, ArrowUpRight } from "lucide-react";

export default function ProgressPage() {
  const { data } = useLearnerProfile();

  const user = data?.user;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Competency Improvement & Progress History
          </h1>
          <Badge variant="gov" className="text-xs">
            ISS / SSS Cadre
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Longitudinal tracking of competency growth, diagnostic evaluation deltas, and learning milestones.
        </p>
      </div>

      {/* Progress Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed Assessments
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-2 mt-1">
              <Award className="w-5 h-5 text-blue-900" />
              <span>3</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-emerald-700 font-medium">+15% score growth</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed Modules
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 mt-1">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>4</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">32 accredited hours on iGOT</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Streak
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-amber-600 flex items-center gap-2 mt-1">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{user?.learningStreakDays || 14} Days</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-slate-500">Active engagement record</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Gap Reduction
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-emerald-700 flex items-center gap-2 mt-1">
              <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              <span>+38%</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-xs text-emerald-700 font-medium">Since baseline assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Before vs After & Longitudinal Comparison Container */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-900" />
            <span>Before vs. After Competency Comparison</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Baseline vs. post-training competency levels across official statistical domains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Baseline (April 2026)
              </span>
              <p className="text-2xl font-bold text-slate-700">Level 2.2 / 5.0</p>
              <p className="text-xs text-slate-500">3 Critical Gaps • 2 Moderate</p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Current Assessed (September 2026)
              </span>
              <p className="text-2xl font-bold text-blue-950">Level 3.1 / 5.0</p>
              <p className="text-xs text-blue-800 font-medium">1 Critical Gap • 2 Moderate (+0.9 Level Delta)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
