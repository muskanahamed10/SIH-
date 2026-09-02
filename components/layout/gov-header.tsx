"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { ShieldCheck, UserCheck } from "lucide-react";
import { usePathname } from "next/navigation";

export function GovHeader() {
  const t = useTranslations("common");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");

  return (
    <header className="border-b bg-white sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar: Government of India identity */}
      <div className="bg-[#0B2545] text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide">भारत सरकार | Government of India</span>
          <span className="text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-200">Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-lg shadow-sm border border-blue-950">
            SS
          </div>
          <div>
            <Link href={`/${locale}`} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight hover:text-blue-900 flex items-center gap-1.5">
              <span>{t("appTitle")}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                iGOT Karmayogi
              </span>
            </Link>
            <p className="text-xs text-slate-500 hidden md:block">
              {t("appSubtitle")}
            </p>
          </div>
        </div>

        {/* Portal view switcher */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href={`/${locale}/learner/dashboard`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>{navT("learner")}</span>
            </Link>
          ) : (
            <Link
              href={`/${locale}/admin/dashboard`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>{navT("admin")}</span>
            </Link>
          )}

          {/* User badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              RV
            </div>
            <div className="hidden lg:block text-left text-xs leading-tight">
              <p className="font-semibold text-slate-800">Rajesh Verma</p>
              <p className="text-slate-500">SSO (NSSO)</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
