"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  FileCheck2,
  Database,
  GitBranch,
  Grid3X3,
  ArrowRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminQuickActions() {
  const t = useTranslations("admin.dashboard.quickActions");
  const locale = useLocale();

  const actions = [
    {
      href: `/${locale}/admin/mcq-review`,
      title: t("mcqReview"),
      description: t("mcqReviewDesc"),
      icon: FileCheck2,
      badge: "SME Review",
      color: "text-amber-600 bg-amber-50"
    },
    {
      href: `/${locale}/admin/competencies`,
      title: t("competencies"),
      description: t("competenciesDesc"),
      icon: Database,
      badge: "Dictionary",
      color: "text-blue-900 bg-blue-50"
    },
    {
      href: `/${locale}/admin/roles`,
      title: t("roles"),
      description: t("rolesDesc"),
      icon: GitBranch,
      badge: "ISS / SSS",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      href: `/${locale}/admin/team`,
      title: t("team"),
      description: t("teamDesc"),
      icon: Grid3X3,
      badge: "5 Divisions",
      color: "text-emerald-700 bg-emerald-50"
    }
  ];

  return (
    <Card
      role="region"
      aria-label={t("title")}
      className="border-slate-200 shadow-xs bg-white rounded-2xl"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-extrabold text-slate-900">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.href}
              href={act.href}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-lg ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <Badge variant="outline" className="text-[10px] font-bold text-slate-600">
                  {act.badge}
                </Badge>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {act.description}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-blue-900 gap-1 pt-1">
                <span>Access</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
