"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PracticeQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const practiceQuestionsByCompetency: Record<string, { name: string; questions: PracticeQuestion[] }> = {
  "comp-stat-model": {
    name: "Statistical Modeling",
    questions: [
      {
        id: "pq-sm-1",
        question:
          "In Ordinary Least Squares (OLS) regression for survey data, which assumption violation primarily causes standard errors to be underestimated when clustering is ignored?",
        options: [
          { id: "A", text: "Heteroscedasticity across survey domains" },
          { id: "B", text: "Intra-cluster correlation among sampling units" },
          { id: "C", text: "Non-normality of the dependent variable" },
          { id: "D", text: "Multicollinearity between survey weights" },
        ],
        correctOptionId: "B",
        explanation:
          "Ignoring intra-cluster correlation in clustered sample designs leads to deflated standard error estimates and inflated Type I error rates. Cluster-robust standard errors or Taylor series linearization must be applied.",
      },
      {
        id: "pq-sm-2",
        question:
          "When specifying a logistic regression model for binary labor force participation, what does an odds ratio of 1.45 for vocational training indicate?",
        options: [
          { id: "A", text: "A 45% increase in the probability of participation" },
          { id: "B", text: "The odds of participation are 45% higher for trained individuals compared to untrained" },
          { id: "C", text: "45% of trained individuals participate in the labor force" },
          { id: "D", text: "The marginal effect at the mean is 0.45" },
        ],
        correctOptionId: "B",
        explanation:
          "An odds ratio of 1.45 corresponds to [OR - 1] * 100 = 45% higher odds of participation relative to the reference category, holding all other covariates constant.",
      },
    ],
  },
  "comp-stat-comp": {
    name: "Statistical Computing",
    questions: [
      {
        id: "pq-sc-1",
        question:
          "Which Python library is specifically optimized for memory-efficient handling of large national microdata files exceeding RAM constraints?",
        options: [
          { id: "A", text: "Polars / DuckDB" },
          { id: "B", text: "Matplotlib" },
          { id: "C", text: "Requests" },
          { id: "D", text: "SymPy" },
        ],
        correctOptionId: "A",
        explanation:
          "Polars and DuckDB utilize arrow-memory formats and lazy streaming execution to process out-of-core microdata sets without memory exhaustion.",
      },
    ],
  },
};

export default function CompetencyPracticeQuizPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("practiceModule");

  const competencyId = (params?.competencyId as string) || "comp-stat-model";
  const competencyData = practiceQuestionsByCompetency[competencyId] || {
    name: "Statistical Modeling",
    questions: practiceQuestionsByCompetency["comp-stat-model"].questions,
  };

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isChecked, setIsChecked] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const currentQ = competencyData.questions[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (!isChecked) {
      setSelectedOption(optId);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsChecked(true);
    if (selectedOption === currentQ.correctOptionId) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < competencyData.questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-200 pb-12">
      {/* Top Breadcrumb Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/learner/learning-path`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToLearningPath")}</span>
        </Link>
        <Badge variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 text-xs font-semibold">
          {competencyData.name}
        </Badge>
      </div>

      {/* Main Practice Container */}
      <Card className="p-6 sm:p-8 shadow-xs border-slate-200 bg-white space-y-6">
        {/* Header */}
        <div className="space-y-2 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-[#0B2545] text-amber-400 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t("title")}: {competencyData.name}
                </h1>
                <p className="text-xs text-slate-500">
                  {t("subtitle")}
                </p>
              </div>
            </div>

            <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs">
              Low-Stakes Practice
            </Badge>
          </div>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {currentIdx + 1} of {competencyData.questions.length}</span>
              <span>Score: {score} / {competencyData.questions.length}</span>
            </div>

            {/* Question Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currentQ.correctOptionId;

                let btnStyles = "border-slate-200 bg-white hover:border-blue-300 text-slate-800";
                if (isSelected) {
                  btnStyles = "border-blue-900 bg-blue-50/50 ring-2 ring-blue-900/10 font-semibold";
                }
                if (isChecked) {
                  if (isCorrect) {
                    btnStyles = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20";
                  } else if (isSelected && !isCorrect) {
                    btnStyles = "border-rose-400 bg-rose-50/60 text-rose-950 font-medium";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isChecked}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-start gap-3.5 focus-visible:ring-2 focus-visible:ring-blue-900 ${btnStyles}`}
                  >
                    <span className="h-6 w-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt.text}</span>
                    {isChecked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {isChecked && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Statistical Explanation Panel */}
            {isChecked && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5 animate-in fade-in-50 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t("explanation")}</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Reset</span>
              </Button>

              {!isChecked ? (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-5 h-9"
                >
                  <span>{t("checkAnswer")}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-5 h-9 flex items-center gap-1.5"
                >
                  <span>{t("nextQuestion")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Completed Screen with Direct Reassessment CTA */
          <div className="p-8 text-center space-y-5">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-slate-900">
                {t("quizCompleted")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t("quizCompletedDesc")}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-500 block">Demonstrated Score</span>
                <strong className="text-base font-extrabold text-slate-900">{Math.round((score / competencyData.questions.length) * 100)}%</strong>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block">Questions Correct</span>
                <strong className="text-base font-extrabold text-emerald-700">{score} / {competencyData.questions.length}</strong>
              </div>
            </div>

            {/* Core CTA: "Take Reassessment" */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={`/${locale}/learner/reassessment/${competencyId}`}>
                <Button className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs h-10 px-6 shadow-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t("takeReassessment")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/learner/learning-path`}>
                <Button variant="outline" className="w-full sm:w-auto text-xs font-semibold border-slate-300">
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
