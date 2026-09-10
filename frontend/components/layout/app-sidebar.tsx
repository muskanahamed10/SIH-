"use client";

import { useEffect } from "react";
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
  BarChart3,
  Grid3X3,
  Database,
  GitBranch,
  CheckCircle2,
  LineChart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X,
  LucideIcon,
  Home,
  Search,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type NavLabelKey =
  | "home"
  | "explore"
  | "myLearning"
  | "myCompetency"
  | "achievement"
  | "dashboard"
  | "competencies"
  | "assessments"
  | "learningPath"
  | "recommendations"
  | "resources"
  | "practice"
  | "progress"
  | "profile"
  | "adminDashboard"
  | "managerDashboard"
  | "team"
  | "teamGaps"
  | "competencyMatrix"
  | "roles"
  | "roleMapping"
  | "questions"
  | "mcqReview"
  | "analytics";

export interface NavItemConfig {
  href: string;
  labelKey: NavLabelKey;
  icon: LucideIcon;
  exact?: boolean;
  aliases?: string[];
  badge?: string;
}

interface AppSidebarProps {
  role: "learner" | "admin";
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({
  role,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  // Learner Navigation Configuration (Karmayogi Integrated)
  const learnerNavItems: NavItemConfig[] = [
    {
      href: `/${locale}`,
      labelKey: "home",
      icon: Home,
      exact: true,
      aliases: [`/${locale}/home`],
    },
    {
      href: `/${locale}/learner`,
      labelKey: "dashboard",
      icon: LayoutDashboard,
      exact: true,
      aliases: [`/${locale}/learner/dashboard`],
    },
    {
      href: `/${locale}/explore`,
      labelKey: "explore",
      icon: Search,
    },
    {
      href: `/${locale}/learning`,
      labelKey: "myLearning",
      icon: BookOpen,
    },
    {
      href: `/${locale}/learner/competency`,
      labelKey: "myCompetency",
      icon: Brain,
      badge: "AI Core",
      aliases: [`/${locale}/learner/competency`],
    },
    {
      href: `/${locale}/learner/assessments`,
      labelKey: "assessments",
      icon: CheckSquare,
      aliases: [`/${locale}/learner/assessment`],
    },
    {
      href: `/${locale}/learner/learning-path`,
      labelKey: "learningPath",
      icon: Route,
    },
    {
      href: `/${locale}/learner/recommendations`,
      labelKey: "recommendations",
      icon: Sparkles,
    },
    {
      href: `/${locale}/learner/resources`,
      labelKey: "resources",
      icon: BookOpen,
    },
    {
      href: `/${locale}/learner/practice`,
      labelKey: "practice",
      icon: CheckSquare,
    },
    {
      href: `/${locale}/learner/progress`,
      labelKey: "progress",
      icon: TrendingUp,
    },
    {
      href: `/${locale}/learner/profile`,
      labelKey: "profile",
      icon: UserCircle,
    },
    {
      href: `/${locale}/achievement`,
      labelKey: "achievement",
      icon: Award,
    },
  ];

  // Admin Navigation Configuration
  const adminNavItems: NavItemConfig[] = [
    {
      href: `/${locale}/admin`,
      labelKey: "adminDashboard",
      icon: BarChart3,
      exact: true,
      aliases: [`/${locale}/admin/dashboard`],
    },
    {
      href: `/${locale}/admin/team`,
      labelKey: "team",
      icon: Grid3X3,
      aliases: [`/${locale}/admin/team-gaps`],
    },
    {
      href: `/${locale}/admin/competencies`,
      labelKey: "competencyMatrix",
      icon: Database,
    },
    {
      href: `/${locale}/admin/roles`,
      labelKey: "roles",
      icon: GitBranch,
    },
    {
      href: `/${locale}/admin/questions`,
      labelKey: "questions",
      icon: CheckCircle2,
      badge: "2",
      aliases: [`/${locale}/admin/mcq-review`],
    },
    {
      href: `/${locale}/admin/analytics`,
      labelKey: "analytics",
      icon: LineChart,
    },
  ];

  const activeNavItems = role === "learner" ? learnerNavItems : adminNavItems;
  const isLearner = role === "learner";

  const content = (
    <div
      className={cn(
        "h-full flex flex-col justify-between p-3 select-none",
        isLearner ? "bg-white text-slate-800" : "bg-slate-900 text-slate-100"
      )}
    >
      <div className="space-y-3">
        {/* Mobile Header with Close Button */}
        <div
          className={cn(
            "lg:hidden flex items-center justify-between pb-2 border-b",
            isLearner ? "border-slate-200" : "border-slate-800"
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isLearner ? "bg-emerald-600" : "bg-amber-400"
              )}
              aria-hidden="true"
            />
            <span className="font-bold text-xs uppercase tracking-wider">
              {isLearner ? t("learner") : t("admin")}
            </span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className={cn(
                "p-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-amber-400",
                isLearner ? "text-slate-500 hover:bg-slate-100" : "text-slate-400 hover:bg-slate-800"
              )}
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop Header & Collapse Button */}
        <div
          className={cn(
            "hidden lg:flex items-center justify-between px-2 pt-1 pb-2 border-b",
            isLearner ? "border-slate-100" : "border-slate-800"
          )}
        >
          {!isCollapsed && (
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isLearner ? "text-slate-400" : "text-slate-400"
              )}
            >
              {isLearner ? t("portal") : t("nsstaGovernance")}
            </span>
          )}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "p-1 rounded-md transition focus-visible:ring-2 focus-visible:ring-amber-400",
                isLearner
                  ? "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  : "text-slate-400 hover:text-white hover:bg-slate-800",
                isCollapsed && "mx-auto"
              )}
              aria-label={t("toggleSidebar")}
              aria-expanded={!isCollapsed}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Semantic Navigation List */}
        <nav aria-label={isLearner ? "Learner Menu" : "Admin Menu"}>
          <ul className="space-y-1">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isExactMatch = pathname === item.href;
              const isAliasMatch = item.aliases?.some((a) =>
                item.exact ? pathname === a : pathname.startsWith(a.split("#")[0])
              );
              const isSubpathMatch = !item.exact && pathname.startsWith(item.href);
              const isActive = isExactMatch || isAliasMatch || isSubpathMatch;

              const label = t(item.labelKey);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative group focus-visible:ring-2 focus-visible:ring-amber-400",
                      // Learner Theme
                      isLearner && (
                        isActive
                          ? "bg-[#0B2545] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      ),
                      // Admin Theme
                      !isLearner && (
                        isActive
                          ? "bg-blue-700 text-white shadow-xs font-semibold"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      ),
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r"
                        aria-hidden="true"
                      />
                    )}

                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                        isActive
                          ? "text-amber-400"
                          : isLearner
                          ? "text-slate-500"
                          : "text-slate-400"
                      )}
                      aria-hidden="true"
                    />

                    {!isCollapsed && <span className="truncate">{label}</span>}

                    {!isCollapsed && item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Role-Specific Bottom Card */}
      {isLearner ? (
        !isCollapsed ? (
          <div className="mt-4 p-3 rounded-lg border border-blue-100 bg-gradient-to-b from-blue-50/70 to-slate-50 text-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-blue-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                <span>iGOT Karmayogi</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
                Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {t("igotCompanionActive")}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex justify-center" title={t("igotCompanionActive")}>
            <div className="p-2 rounded-md bg-blue-50 text-blue-800">
              <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            </div>
          </div>
        )
      ) : (
        !isCollapsed ? (
          <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{t("nsstaGovernance")}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {t("cadreReviewCell")}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex justify-center" title={t("nsstaGovernance")}>
            <div className="p-2 rounded-md bg-slate-800 text-amber-400">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
        )
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden lg:block border-r transition-all duration-200 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto",
          isLearner ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900",
          isCollapsed ? "w-16" : "w-64"
        )}
        aria-label={isLearner ? "Official Learner Sidebar" : "Admin Governance Sidebar"}
      >
        {content}
      </aside>

      {/* Mobile Drawer Sheet & Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            className={cn(
              "fixed inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200",
              isLearner ? "bg-white" : "bg-slate-900"
            )}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
