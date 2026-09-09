"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchLocale = (nextLocale: "en" | "hi") => {
    const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    const segments = pathname.split("/");

    let targetPath = "";
    if (segments[1] === "en" || segments[1] === "hi") {
      segments[1] = nextLocale;
      targetPath = segments.join("/");
    } else {
      targetPath = `/${nextLocale}${pathname}`;
    }

    router.push(`${targetPath}${queryString}`);
  };

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "hi" : "en";
    switchLocale(nextLocale);
  };

  const isHindi = currentLocale === "hi";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      data-testid="language-switcher"
      aria-label="Toggle language"
      title={isHindi ? "Switch to English" : "हिन्दी में बदलें (Switch to Hindi)"}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg",
        "border border-blue-900/80 bg-blue-950/60 hover:bg-blue-900/80 text-white transition-all shadow-2xs backdrop-blur-xs",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none",
        className
      )}
    >
      <Languages className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
      <span className="flex items-center gap-1 text-[11px] sm:text-xs">
        <span
          className={cn(
            "transition-colors",
            !isHindi ? "text-white font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2" : "text-blue-300/80 font-medium"
          )}
        >
          English
        </span>
        <span className="text-blue-400/50 text-[10px]" aria-hidden="true">|</span>
        <span
          className={cn(
            "transition-colors font-devanagari",
            isHindi ? "text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2" : "text-blue-300/80 font-medium"
          )}
        >
          हिन्दी
        </span>
      </span>
    </button>
  );
}
