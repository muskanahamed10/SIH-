"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationDropdown } from "./notification-dropdown";
import { UserNav } from "./user-nav";
import { ShieldCheck, UserCheck, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export function GovHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const t = useTranslations("common");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin") || pathname.includes("/manager");
  const isLearner = pathname.includes("/learner") || pathname.includes("/explore") || pathname.includes("/learning") || pathname.includes("/achievement") || pathname.includes("/home");

  return (
    <header className="border-b bg-white sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar: Government of India identity */}
      <div className="bg-[#0B2545] text-white text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center border-b border-blue-950">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          {/* Subtle Indian Flag Color Accent Bar */}
          <div className="flex flex-col h-3.5 w-1 rounded overflow-hidden mr-1">
            <span className="bg-[#FF9933] flex-1" />
            <span className="bg-white flex-1" />
            <span className="bg-[#138808] flex-1" />
          </div>
          <span className="font-semibold tracking-wide">{t("govOfIndia")}</span>
          <span className="text-blue-300/60 hidden md:inline">|</span>
          <span className="hidden md:inline text-blue-100/90">{t("mospi")}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationDropdown />
          <div className="h-3.5 w-[1px] bg-blue-800" />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main navigation header - full width so brand is anchored to the corner */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {(isLearner || isAdmin) && onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-800 shrink-0"
              aria-label={navT("toggleSidebar")}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Official Brand Block with Karmayogi Emblem */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 sm:gap-2.5 group focus-visible:ring-2 focus-visible:ring-blue-800 rounded-lg py-1 px-0.5 sm:px-1 transition shrink-0"
            aria-label="Official Statistical System - Mission Karmayogi"
          >
            {/* Official Karmayogi Emblem Logo (at MoSPI place) */}
            <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/90 bg-white shadow-xs">
              <Image
                src="/assets/images/karmayogi-emblem.png"
                alt="Mission Karmayogi Bharat"
                width={40}
                height={40}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            {/* Platform Identity & Tagline */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-blue-900 transition whitespace-nowrap">
                  {t("appTitle")}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5 max-w-[180px] sm:max-w-[260px]">
                {t("appSubtitle")}
              </p>
            </div>
          </Link>
        </div>

        {/* Portal view switcher & User profile menu */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href={`/${locale}/learner`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">{navT("learner")}</span>
            </Link>
          ) : (
            <Link
              href={`/${locale}/admin`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition focus-visible:ring-2 focus-visible:ring-blue-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">{navT("admin")}</span>
            </Link>
          )}

          <div className="h-6 w-[1px] bg-slate-200" />

          {/* User profile nav */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
