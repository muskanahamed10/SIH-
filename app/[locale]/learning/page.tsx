"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, Clock, CheckCircle2, Award, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyLearningPage() {
  const t = useTranslations("myLearning");
  const locale = useLocale();

  const enrolledCourses = [
    {
      id: "course-1",
      title: "Python for Official Statistics & Microdata",
      provider: "National Statistical Systems Training Academy (NSSTA)",
      duration: "4 hours",
      progress: 45,
      status: "in_progress",
      competency: "Statistical Computing",
      lastAccessed: "2 hours ago",
    },
    {
      id: "course-2",
      title: "Survey Sampling Design & Estimation Standards",
      provider: "NSSO Methodology Division",
      duration: "3 hours",
      progress: 100,
      status: "completed",
      competency: "Survey Methodology",
      lastAccessed: "15 Aug 2026",
    },
    {
      id: "course-3",
      title: "Time Series Econometrics & Seasonal Adjustments",
      provider: "Reserve Bank of India (DEPR) & NSSTA",
      duration: "5 hours",
      progress: 20,
      status: "in_progress",
      competency: "Statistical Modeling",
      lastAccessed: "25 Aug 2026",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-900" aria-hidden="true" />
            <span>{t("title")}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t("subtitle")}
          </p>
        </div>

        <Link href={`/${locale}/explore`}>
          <Button variant="outline" size="sm" className="text-xs font-semibold self-start sm:self-auto">
            Browse More Courses
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="p-5 shadow-xs border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-900 border-blue-200">
                  {course.competency}
                </Badge>
                {course.status === "completed" ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    <span>{t("completed")}</span>
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-900 border-blue-200 text-[10px]">
                    {t("inProgress")}
                  </Badge>
                )}
              </div>

              <h2 className="font-bold text-base text-slate-900 leading-snug">
                {course.title}
              </h2>

              <p className="text-xs text-slate-500 font-medium">
                {course.provider}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>{course.duration}</span>
                </span>
                <span>•</span>
                <span>Accessed {course.lastAccessed}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Course Progress</span>
                  <span className="text-slate-900">{course.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      course.progress === 100 ? "bg-emerald-600" : "bg-blue-800"
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link href={course.status === "completed" ? `/${locale}/achievement` : `/${locale}/learner/resources/rec-stat-model-101`}>
                <Button
                  className={`w-full text-xs font-semibold flex items-center justify-center gap-2 ${
                    course.status === "completed"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      : "bg-[#0B2545] hover:bg-[#134074] text-white"
                  }`}
                >
                  {course.status === "completed" ? (
                    <>
                      <Award className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                      <span>Review Certificate</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Continue Learning</span>
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
