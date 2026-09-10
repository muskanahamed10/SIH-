"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useCompetencies } from "@/hooks/use-queries";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

export default function PracticeQuizzesPage() {
  const locale = useLocale();
  const { data: competencies } = useCompetencies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Diagnostic Practice Quizzes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Low-stakes practice mode with instant answers and detailed statistical explanations to reinforce domain mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competencies?.map((comp) => (
          <Card key={comp.id} className="border-slate-200 hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="gov" className="text-[10px]">
                  {comp.code}
                </Badge>
                <span className="text-xs text-slate-400 font-medium">5 Questions</span>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-2">
                {comp.name}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {comp.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 border-t border-slate-100">
              <Link href={`/${locale}/learner/practice/${comp.id}`} className="w-full">
                <Button size="sm" variant="outline" className="w-full text-xs font-semibold hover:bg-blue-50 hover:text-blue-900 gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-blue-700" />
                  <span>Start Practice Quiz</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
