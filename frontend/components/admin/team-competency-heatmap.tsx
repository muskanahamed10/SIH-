"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Users,
  User,
  AlertTriangle,
  BookOpen,
  X,
  ExternalLink,
  Info
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  mockHeatmapTeams,
  mockHeatmapEmployees
} from "@/mocks/data/admin";
import {
  CompetencyHeatmapSeverity,
  HeatmapCellDetail
} from "@/types";

interface TeamCompetencyHeatmapProps {
  initialView?: "teams" | "employees";
  className?: string;
}

export function TeamCompetencyHeatmap({
  initialView = "teams",
  className = ""
}: TeamCompetencyHeatmapProps) {
  const t = useTranslations("admin.teamHeatmapComponent");

  const [viewMode, setViewMode] = React.useState<"teams" | "employees">(initialView);
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");
  const [activeCellDetail, setActiveCellDetail] = React.useState<HeatmapCellDetail | null>(null);



  // Core 4 user-specified competencies + 2 official MoSPI extensions
  const competencies = [
    { key: "python", label: t("competencyPython"), benchmark: 80 },
    { key: "statistics", label: t("competencyStatistics"), benchmark: 80 },
    { key: "survey", label: t("competencySurvey"), benchmark: 80 },
    { key: "visualization", label: t("competencyVisualization"), benchmark: 75 },
    { key: "dataManagement", label: t("competencyDataMgmt"), benchmark: 80 },
    { key: "officialStandards", label: t("competencyStandards"), benchmark: 80 },
  ] as const;

  type CompKey = typeof competencies[number]["key"];

  const getSeverity = (score: number): CompetencyHeatmapSeverity => {
    if (score < 50) return "critical";
    if (score < 70) return "moderate";
    if (score < 85) return "meets";
    return "exceeds";
  };

  const getSeverityBadgeClass = (score: number) => {
    if (score < 50) {
      return "bg-rose-100 text-rose-950 border-rose-300 ring-1 ring-rose-200 font-extrabold";
    }
    if (score < 70) {
      return "bg-amber-100 text-amber-950 border-amber-300 font-bold";
    }
    if (score < 85) {
      return "bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold";
    }
    return "bg-blue-100 text-blue-950 border-blue-300 font-extrabold";
  };

  const getSeverityLabel = (severity: CompetencyHeatmapSeverity) => {
    switch (severity) {
      case "critical":
        return t("severityCriticalLabel");
      case "moderate":
        return t("severityModerateLabel");
      case "meets":
        return t("severityMeetsLabel");
      case "exceeds":
        return t("severityExceedsLabel");
    }
  };

  const getRecommendedCourseForComp = (compKey: CompKey) => {
    switch (compKey) {
      case "python":
        return {
          title: "Python for Official Statistics: Survey Data Cleaning & Tabulation",
          provider: "iGOT Karmayogi / NSSTA",
          duration: "18 Hours"
        };
      case "statistics":
        return {
          title: "Statistical Inference & Analytical Estimation for Official Surveys",
          provider: "iGOT Karmayogi / ISI Kolkata",
          duration: "14 Hours"
        };
      case "survey":
        return {
          title: "Advanced Sample Survey Design, Stratification & Field Manuals",
          provider: "NSSTA Masterclass / SDRD",
          duration: "16 Hours"
        };
      case "visualization":
        return {
          title: "Spatial Data Analysis & Thematic Cartography for Official Data",
          provider: "iGOT Karmayogi / SDRD",
          duration: "10 Hours"
        };
      case "dataManagement":
        return {
          title: "Microdata Curation, Anonymization & SDMX Standards",
          provider: "iGOT Karmayogi / DQAD",
          duration: "12 Hours"
        };
      case "officialStandards":
      default:
        return {
          title: "System of National Accounts (SNA 2008): Supply-Use Tables & Compilation",
          provider: "NSSTA Masterclass / NAD",
          duration: "15 Hours"
        };
    }
  };

  const handleCellClick = (
    targetName: string,
    isTeam: boolean,
    department: string,
    compKey: CompKey,
    compTitle: string,
    score: number,
    benchmark: number
  ) => {
    const severity = getSeverity(score);
    const gap = benchmark - score;
    const course = getRecommendedCourseForComp(compKey);

    setActiveCellDetail({
      targetName,
      isTeam,
      department,
      competencyKey: compKey,
      competencyTitle: compTitle,
      score,
      benchmark,
      gap,
      severity,
      recommendedCourse: course
    });
  };

  // Filtered Teams
  const filteredTeams = React.useMemo(() => {
    return mockHeatmapTeams.filter((team) => {
      // Department filter
      if (selectedDepartment !== "all" && team.id !== selectedDepartment) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = team.teamName.toLowerCase().includes(q);
        const deptMatch = team.department.toLowerCase().includes(q);
        if (!nameMatch && !deptMatch) return false;
      }
      // Severity filter
      if (severityFilter === "critical") {
        const hasCritical = Object.values(team.scores).some((s) => s !== undefined && s < 50);
        if (!hasCritical) return false;
      } else if (severityFilter === "below") {
        const hasBelow = Object.values(team.scores).some((s) => s !== undefined && s < 70);
        if (!hasBelow) return false;
      } else if (severityFilter === "meets") {
        const allMeets = Object.values(team.scores).every((s) => s === undefined || s >= 70);
        if (!allMeets) return false;
      }
      return true;
    });
  }, [selectedDepartment, searchQuery, severityFilter]);

  // Filtered Employees
  const filteredEmployees = React.useMemo(() => {
    return mockHeatmapEmployees.filter((emp) => {
      // Department / team filter
      if (selectedDepartment !== "all") {
        const teamMatch =
          (selectedDepartment === "team-a" && emp.team === "Team A") ||
          (selectedDepartment === "team-b" && emp.team === "Team B") ||
          (selectedDepartment === "team-c" && emp.team === "Team C") ||
          (selectedDepartment === "team-d" && emp.team === "Team D") ||
          (selectedDepartment === "team-e" && emp.team === "Team E");
        if (!teamMatch) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = emp.name.toLowerCase().includes(q);
        const roleMatch = emp.role.toLowerCase().includes(q);
        const deptMatch = emp.department.toLowerCase().includes(q);
        if (!nameMatch && !roleMatch && !deptMatch) return false;
      }
      // Severity filter
      if (severityFilter === "critical") {
        const hasCritical = Object.values(emp.scores).some((s) => s !== undefined && s < 50);
        if (!hasCritical) return false;
      } else if (severityFilter === "below") {
        const hasBelow = Object.values(emp.scores).some((s) => s !== undefined && s < 70);
        if (!hasBelow) return false;
      } else if (severityFilter === "meets") {
        const allMeets = Object.values(emp.scores).every((s) => s === undefined || s >= 70);
        if (!allMeets) return false;
      }
      return true;
    });
  }, [selectedDepartment, searchQuery, severityFilter]);

  // Column Averages for Summary Row
  const computeColumnAverage = (compKey: CompKey) => {
    if (viewMode === "teams") {
      if (filteredTeams.length === 0) return 0;
      const sum = filteredTeams.reduce((acc, t) => acc + (t.scores[compKey] || 0), 0);
      return Math.round(sum / filteredTeams.length);
    } else {
      if (filteredEmployees.length === 0) return 0;
      const sum = filteredEmployees.reduce((acc, e) => acc + (e.scores[compKey] || 0), 0);
      return Math.round(sum / filteredEmployees.length);
    }
  };

  const computeOverallAverage = () => {
    if (viewMode === "teams") {
      if (filteredTeams.length === 0) return 0;
      const sum = filteredTeams.reduce((acc, t) => acc + t.averageScore, 0);
      return (sum / filteredTeams.length).toFixed(1);
    } else {
      if (filteredEmployees.length === 0) return 0;
      const sum = filteredEmployees.reduce((acc, e) => acc + e.averageScore, 0);
      return (sum / filteredEmployees.length).toFixed(1);
    }
  };

  return (
    <Card
      role="region"
      aria-label={t("title")}
      className={`border-slate-200 shadow-xs bg-white rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header & Controls Toolbar */}
      <CardHeader className="p-5 pb-4 border-b border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {t("title")}
              </CardTitle>
              <Badge className="bg-[#0B2545] text-white text-[10px] font-bold">
                Interactive Heatmap
              </Badge>
              <Badge variant="outline" className="text-amber-800 bg-amber-50 border-amber-200 text-[10px] font-semibold">
                {t("demoDataBadge")}
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              {t("subtitle")}
            </CardDescription>
          </div>

          {/* View Mode Switcher: Teams vs Employees */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("teams")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === "teams"
                  ? "bg-[#0B2545] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t("viewTeams")}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("employees")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === "employees"
                  ? "bg-[#0B2545] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t("viewEmployees")}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Department / Team Filter */}
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t("filterDepartmentLabel")}
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full text-xs font-medium h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545]"
            >
              <option value="all">{t("filterAllDepartments")}</option>
              <option value="team-a">Team A (National Accounts Division)</option>
              <option value="team-b">Team B (Field Operations Division)</option>
              <option value="team-c">Team C (Survey Design & Research)</option>
              <option value="team-d">Team D (Data Quality Assurance)</option>
              <option value="team-e">Team E (Economic Statistics Division)</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t("severityFilterLabel")}
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full text-xs font-medium h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545]"
            >
              <option value="all">{t("severityAll")}</option>
              <option value="critical">{t("severityCritical")}</option>
              <option value="below">{t("severityBelow")}</option>
              <option value="meets">{t("severityMeets")}</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {t("searchLabel")}
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Accessible Semantic Table Container with Horizontal Scroll */}
        <div className="overflow-x-auto">
          <table
            role="table"
            aria-label="Team Competency Heatmap Matrix"
            className="w-full text-xs text-left border-collapse"
          >
            <caption className="sr-only">
              {t("tableCaption")}
            </caption>

            {/* Table Header */}
            <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th
                  scope="col"
                  className="p-3.5 sticky left-0 bg-slate-50 z-20 min-w-[220px] font-extrabold text-slate-900 border-r border-slate-200"
                >
                  {t("colTarget")}
                </th>
                <th scope="col" className="p-3.5 min-w-[180px]">
                  {t("colDepartment")}
                </th>
                {viewMode === "teams" && (
                  <th scope="col" className="p-3.5 text-center min-w-[90px]">
                    {t("colHeadcount")}
                  </th>
                )}
                {competencies.map((comp) => (
                  <th
                    key={comp.key}
                    scope="col"
                    className="p-3.5 text-center min-w-[110px]"
                  >
                    <div className="font-extrabold text-slate-800">{comp.label}</div>
                    <span className="text-[10px] font-medium text-slate-400">
                      Req: {comp.benchmark}%
                    </span>
                  </th>
                ))}
                <th
                  scope="col"
                  className="p-3.5 text-center min-w-[100px] font-extrabold text-slate-900 bg-slate-100/80"
                >
                  {t("colAverage")}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {viewMode === "teams" ? (
                filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <tr
                      key={team.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Row Header: Team Name */}
                      <th
                        scope="row"
                        className="p-3.5 sticky left-0 bg-white group-hover:bg-slate-50/60 z-10 font-extrabold text-slate-900 border-r border-slate-200 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0B2545]" />
                          <span>{team.teamName}</span>
                        </div>
                      </th>

                      {/* Department */}
                      <td className="p-3.5 text-slate-600 font-medium">
                        {team.department}
                      </td>

                      {/* Headcount */}
                      <td className="p-3.5 text-center text-slate-600 font-semibold">
                        {team.headcount} {t("officersSuffix")}
                      </td>

                      {/* Competency Cells */}
                      {competencies.map((comp) => {
                        const score = team.scores[comp.key] || 0;
                        const severity = getSeverity(score);
                        const badgeStyle = getSeverityBadgeClass(score);

                        return (
                          <td
                            key={comp.key}
                            className="p-2.5 text-center"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleCellClick(
                                  team.teamName,
                                  true,
                                  team.department,
                                  comp.key,
                                  comp.label,
                                  score,
                                  comp.benchmark
                                )
                              }
                              className={`w-full py-1.5 px-2 rounded-lg border text-xs text-center transition-all cursor-pointer hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0B2545] ${badgeStyle}`}
                              aria-label={`${team.teamName}, ${comp.label}, Score: ${score}%, ${getSeverityLabel(severity)}`}
                            >
                              <span>{score}%</span>
                              <span className="sr-only">
                                {t("srScorePrefix")} {score}%, {t("srSeverityPrefix")} {getSeverityLabel(severity)}
                              </span>
                            </button>
                          </td>
                        );
                      })}

                      {/* Overall Average */}
                      <td className="p-3.5 text-center font-extrabold text-sm text-slate-900 bg-slate-50/70">
                        {team.averageScore.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={competencies.length + 3} className="p-8 text-center text-slate-400">
                      No teams match the selected filter criteria.
                    </td>
                  </tr>
                )
              ) : (
                /* Individual Employees View */
                filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Row Header: Employee Name */}
                      <th
                        scope="row"
                        className="p-3.5 sticky left-0 bg-white group-hover:bg-slate-50/60 z-10 font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap"
                      >
                        <div>{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{emp.role}</div>
                      </th>

                      {/* Department & Team */}
                      <td className="p-3.5 text-slate-600">
                        <span className="font-semibold text-slate-800 block">{emp.team}</span>
                        <span className="text-[11px] text-slate-400">{emp.department}</span>
                      </td>

                      {/* Competency Cells */}
                      {competencies.map((comp) => {
                        const score = emp.scores[comp.key] || 0;
                        const severity = getSeverity(score);
                        const badgeStyle = getSeverityBadgeClass(score);

                        return (
                          <td
                            key={comp.key}
                            className="p-2.5 text-center"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleCellClick(
                                  emp.name,
                                  false,
                                  emp.department,
                                  comp.key,
                                  comp.label,
                                  score,
                                  comp.benchmark
                                )
                              }
                              className={`w-full py-1.5 px-2 rounded-lg border text-xs text-center transition-all cursor-pointer hover:scale-105 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0B2545] ${badgeStyle}`}
                              aria-label={`${emp.name}, ${comp.label}, Score: ${score}%, ${getSeverityLabel(severity)}`}
                            >
                              <span>{score}%</span>
                              <span className="sr-only">
                                {t("srScorePrefix")} {score}%, {t("srSeverityPrefix")} {getSeverityLabel(severity)}
                              </span>
                            </button>
                          </td>
                        );
                      })}

                      {/* Overall Average */}
                      <td className="p-3.5 text-center font-extrabold text-sm text-slate-900 bg-slate-50/70">
                        {emp.averageScore.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={competencies.length + 3} className="p-8 text-center text-slate-400">
                      No officers match the selected filter criteria.
                    </td>
                  </tr>
                )
              )}
            </tbody>

            {/* Table Footer: Summary Averages */}
            <tfoot className="bg-slate-100/95 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <th
                  scope="row"
                  className="p-3.5 sticky left-0 bg-slate-100 z-20 font-extrabold border-r border-slate-200"
                >
                  {t("summaryRow")}
                </th>
                <td className="p-3.5 text-slate-500 font-semibold text-[11px]">
                  {viewMode === "teams"
                    ? `${filteredTeams.length} Teams`
                    : `${filteredEmployees.length} Officers`}
                </td>
                {viewMode === "teams" && <td className="p-3.5 text-center text-slate-400">-</td>}
                {competencies.map((comp) => {
                  const avg = computeColumnAverage(comp.key);
                  const severityClass = getSeverityBadgeClass(avg);

                  return (
                    <td key={comp.key} className="p-2.5 text-center">
                      <span className={`inline-block w-full py-1 px-2 rounded-md border text-xs font-extrabold ${severityClass}`}>
                        {avg}%
                      </span>
                    </td>
                  );
                })}
                <td className="p-3.5 text-center font-black text-sm text-slate-950 bg-slate-200/80">
                  {computeOverallAverage()}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Visual Severity Legend Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px]">
              {t("legendTitle")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-950 border border-rose-300 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span>{t("severityCriticalLabel")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>{t("severityModerateLabel")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{t("severityMeetsLabel")}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-950 border border-blue-300 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{t("severityExceedsLabel")}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Click on any score cell to inspect competency gap & accredited iGOT recommendations.
          </div>
        </div>
      </CardContent>

      {/* Cell Drilldown & Remediation Modal */}
      {activeCellDetail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drilldown-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 id="drilldown-title" className="text-lg font-extrabold text-slate-900">
                  {t("modalTitle")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t("modalSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCellDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Gap Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{t("modalTarget")}</span>
                <span className="font-bold text-slate-900 text-sm">{activeCellDetail.targetName}</span>
                <span className="text-[10px] text-slate-400 block">{activeCellDetail.department}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t("modalCompetency")}</span>
                <span className="font-bold text-slate-900 text-sm">{activeCellDetail.competencyTitle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[11px]">{t("modalDemonstrated")}</span>
                <span className="font-extrabold text-base text-slate-900">{activeCellDetail.score}%</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[11px]">{t("modalBenchmark")}</span>
                <span className="font-bold text-base text-slate-700">{activeCellDetail.benchmark}%</span>
              </div>
            </div>

            {/* Severity Status Banner */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${getSeverityBadgeClass(activeCellDetail.score)}`}>
              <div className="flex items-center gap-2">
                {activeCellDetail.score < 50 ? (
                  <AlertTriangle className="w-4 h-4 text-rose-700" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
                <span className="font-extrabold text-xs">
                  {getSeverityLabel(activeCellDetail.severity)}
                </span>
              </div>
              <span className="text-xs font-bold">
                {activeCellDetail.gap > 0 ? `-${activeCellDetail.gap}% Gap` : "Benchmark Met ✓"}
              </span>
            </div>

            {/* Recommended iGOT Course Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-blue-900">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {t("modalRecommendedCourse")}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {activeCellDetail.recommendedCourse.title}
              </h4>
              <p className="text-xs text-slate-500">
                Provider: {activeCellDetail.recommendedCourse.provider} • Duration: {activeCellDetail.recommendedCourse.duration}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveCellDetail(null)}
                className="text-xs font-semibold"
              >
                {t("modalClose")}
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveCellDetail(null)}
                className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold gap-1.5"
              >
                <span>{t("modalEnrollCta")}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
