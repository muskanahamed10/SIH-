"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Award,
  Route,
  BookOpen,
  CheckSquare,
  TrendingUp,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Brain,
  UploadCloud,
  Home,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LearnerSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function LearnerSidebar({
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: LearnerSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    {
      href: `/${locale}`,
      label: t("home"),
      icon: Home,
      exact: true,
      aliases: [`/${locale}/home`],
    },
    {
      href: `/${locale}/learner`,
      label: t("dashboard"),
      icon: LayoutDashboard,
      exact: true,
      aliases: [`/${locale}/learner/dashboard`],
    },
    {
      href: `/${locale}/explore`,
      label: t("explore"),
      icon: Search,
    },
    {
      href: `/${locale}/learning`,
      label: t("myLearning"),
      icon: BookOpen,
    },
    {
      href: `/${locale}/learner/competency`,
      label: t("myCompetency"),
      icon: Brain,
      aliases: [`/${locale}/learner/competency`],
    },
    {
      href: `/${locale}/learner/learning-path`,
      label: t("learningPath"),
      icon: Route,
    },
    {
      href: `/${locale}/learner/assessments`,
      label: t("assessments"),
      icon: Award,
      aliases: [`/${locale}/learner/assessment`],
    },
    {
      href: `/${locale}/learner/recommendations`,
      label: t("recommendations"),
      icon: Sparkles,
    },
    {
      href: `/${locale}/achievement`,
      label: t("achievement"),
      icon: Award,
    },
    {
      href: `/${locale}/learner/resources`,
      label: t("resources"),
      icon: BookOpen,
    },
    {
      href: `/${locale}/learner/practice`,
      label: t("practice"),
      icon: CheckSquare,
    },
    {
      href: `/${locale}/learner/quiz-generator`,
      label: t("quizGenerator"),
      icon: UploadCloud,
    },
    {
      href: `/${locale}/learner/progress`,
      label: t("progress"),
      icon: TrendingUp,
    },
    {
      href: `/${locale}/learner/profile`,
      label: t("profile"),
      icon: UserCircle,
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-3">
      <div className="space-y-4">
        {/* Mobile header close button */}
        <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{t("portal")}</span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop collapse button */}
        <div className="hidden lg:flex items-center justify-between px-2 pt-1 pb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("portal")}
            </span>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition",
                isCollapsed && "mx-auto"
              )}
              aria-label={t("toggleSidebar")}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Learner Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExactMatch = pathname === item.href;
            const isAliasMatch = item.aliases?.some((a) =>
              item.exact ? pathname === a : pathname.startsWith(a.split("#")[0])
            );
            const isSubpathMatch = !item.exact && pathname.startsWith(item.href);
            const isActive = isExactMatch || isAliasMatch || isSubpathMatch;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative",
                  isActive
                    ? "bg-[#0B2545] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                  isCollapsed && "justify-center px-2"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r" />
                )}
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-amber-400" : "text-slate-500")} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom iGOT Karmayogi Companion status card */}
      {!isCollapsed ? (
        <div className="mt-6 p-3 rounded-lg border border-blue-100 bg-gradient-to-b from-blue-50/70 to-slate-50 text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>iGOT Karmayogi</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
              Sync
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            {t("igotCompanionActive")}
          </p>
          <div className="text-[10px] text-slate-400">
            {t("syncConnected")}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-center" title={t("igotCompanionActive")}>
          <div className="p-2 rounded-md bg-blue-50 text-blue-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:block border-r border-slate-200 bg-white transition-all duration-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
