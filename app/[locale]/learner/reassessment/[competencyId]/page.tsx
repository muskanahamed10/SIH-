"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReassessmentQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const reassessmentDataByCompetency: Record<
  string,
  { name: string; baselineScore: number; requiredScore: number; questions: ReassessmentQuestion[] }
> = {
  "comp-stat-model": {
    name: "Statistical Modeling",
    baselineScore: 42,
    requiredScore: 80,
    questions: [
      {
        id: "rq-sm-1",
        question:
          "Which post-estimation specification test is mandatory in MoSPI national sample surveys to verify that variance estimates account for complex multi-stage stratification?",
        options: [
          { id: "A", text: "Balanced Repeated Replication (BRR) or Jackknife repeated replication" },
          { id: "B", text: "Standard unweighted Student's t-test" },
          { id: "C", text: "Simple Pearson correlation coefficient" },
          { id: "D", text: "Durbin-Watson test for autocorrelation only" },
        ],
        correctOptionId: "A",
      },
      {
        id: "rq-sm-2",
        question:
          "When handling survey non-response in official statistical modeling, what calibration method preserves national marginal population totals across socio-economic categories?",
        options: [
          { id: "A", text: "Complete case deletion (listwise deletion)" },
          { id: "B", text: "Generalized Raking Ratio / Calibration Weighting (Deville & Särndal)" },
          { id: "C", text: "Mean substitution using unweighted sample mean" },
          { id: "D", text: "Arbitrary percentage inflation" },
        ],
        correctOptionId: "B",
      },
    ],
  },
  "comp-stat-comp": {
    name: "Statistical Computing",
    baselineScore: 61,
    requiredScore: 85,
    questions: [
      {
        id: "rq-sc-1",
        question:
          "In reproducible official statistical data pipelines, what is the primary benefit of containerization (Docker) and version-locked lockfiles?",
        options: [
          { id: "A", text: "Identical statistical outputs across varying institutional computing servers" },
          { id: "B", text: "Automatic correction of survey data entry errors" },
          { id: "C", text: "Bypassing governmental security firewalls" },
          { id: "D", text: "Eliminating the need for unit testing" },
        ],
        correctOptionId: "A",
      },
    ],
  },
};

export default function CompetencyReassessmentPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("reassessmentModule");

  const competencyId = (params?.competencyId as string) || "comp-stat-model";
  const data = reassessmentDataByCompetency[competencyId] || {
    name: "Statistical Modeling",
    baselineScore: 42,
    requiredScore: 80,
    questions: reassessmentDataByCompetency["comp-stat-model"].questions,
  };

  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEvaluated, setIsEvaluated] = React.useState(false);
  const [reassessedScore, setReassessedScore] = React.useState(85);

  const handleSelectOption = (qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const allAnswered = data.questions.every((q) => !!answers[q.id]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Evaluate score
      let correct = 0;
      data.questions.forEach((q) => {
        if (answers[q.id] === q.correctOptionId) {
          correct += 1;
        }
      });
      const computedScore = Math.max(Math.round((correct / data.questions.length) * 100), 82);
      setReassessedScore(computedScore);
      setIsSubmitting(false);
      setIsEvaluated(true);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200 pb-12">
      {/* Top Navigation Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/learner/learning-path`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToLearningPath")}</span>
        </Link>
        <Badge className="bg-[#0B2545] text-white text-xs font-bold px-2.5 py-0.5">
          Cadre Benchmark Reassessment
        </Badge>
      </div>

      {/* Main Container */}
      <Card className="p-6 sm:p-8 shadow-xs border-slate-200 bg-white space-y-6">
        {/* Header */}
        <div className="space-y-3 pb-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-300">
                <ShieldCheck className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t("title")}: {data.name}
                </h1>
                <p className="text-xs text-slate-500">
                  {t("subtitle")}
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-bold self-start sm:self-auto">
              Role Benchmark: {data.requiredScore}%
            </Badge>
          </div>

          {/* Benchmark Comparison Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t("baselineScore")}
              </span>
              <strong className="text-xl font-extrabold text-slate-700">
                {data.baselineScore}%
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-[11px] font-semibold text-blue-900 block">
                {t("targetScore")}
              </span>
              <strong className="text-xl font-extrabold text-blue-950">
                {data.requiredScore}%
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-amber-900 block">
                Targeted Improvement
              </span>
              <strong className="text-xl font-extrabold text-amber-900">
                +{data.requiredScore - data.baselineScore} points
              </strong>
            </div>
          </div>
        </div>

        {!isEvaluated ? (
          /* Reassessment Question Runner */
          <div className="space-y-6">
            <div className="space-y-4">
              {data.questions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="h-6 w-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 leading-relaxed">
                      {q.question}
                    </h2>
                  </div>

                  <div className="space-y-2 pt-1 pl-8">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition flex items-start gap-3 ${
                            isSelected
                              ? "border-blue-900 bg-blue-50 font-semibold ring-2 ring-blue-900/10 text-blue-950"
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          <span className="font-bold">{opt.id}.</span>
                          <span className="leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {Object.keys(answers).length} of {data.questions.length} questions answered
              </span>

              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-6 h-10 shadow-sm flex items-center gap-2"
              >
                <span>{isSubmitting ? t("submitting") : t("submitReassessment")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Button>
            </div>
          </div>
        ) : (
          /* Reassessment Success & Improvement Score Card */
          <div className="p-8 text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("statusImproved")}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t("reassessmentComplete")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                {t("reassessmentCompleteDesc")}
              </p>
            </div>

            {/* Before vs After Progression Card */}
            <div className="p-5 rounded-2xl bg-linear-to-r from-blue-50/80 to-emerald-50/80 border border-emerald-200 max-w-md mx-auto grid grid-cols-2 gap-4">
              <div className="space-y-1 border-r border-slate-200 pr-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Initial Baseline
                </span>
                <strong className="text-2xl font-extrabold text-slate-700">
                  {data.baselineScore}%
                </strong>
                <span className="text-[10px] text-slate-400 block">Identified Gap: -{data.requiredScore - data.baselineScore} pts</span>
              </div>

              <div className="space-y-1 pl-2">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Reassessed Score
                </span>
                <strong className="text-2xl font-extrabold text-emerald-800">
                  {reassessedScore}%
                </strong>
                <span className="text-[10px] font-bold text-emerald-700 block flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{reassessedScore - data.baselineScore} pts Gain</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/${locale}/learner/competency`}>
                <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs h-10 px-6 shadow-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{t("viewUpdatedCompetency")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/learner/profile`}>
                <Button variant="outline" className="w-full sm:w-auto text-xs font-semibold border-blue-200 text-blue-900 hover:bg-blue-50 h-10 px-5">
                  <span>View Profile</span>
                </Button>
              </Link>
              <Link href={`/${locale}/learner/learning-path`}>
                <Button variant="outline" className="w-full sm:w-auto text-xs font-semibold border-slate-300 h-10 px-5">
                  <span>{t("backToLearningPath")}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
