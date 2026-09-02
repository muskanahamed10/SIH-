"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "hi" : "en";
    // Replace current locale prefix in pathname
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "hi") {
      segments[1] = nextLocale;
      router.push(segments.join("/") || `/${nextLocale}`);
    } else {
      router.push(`/${nextLocale}${pathname}`);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm"
      title="Toggle Language / भाषा बदलें"
      aria-label="Toggle language"
    >
      <Languages className="w-3.5 h-3.5 text-blue-700" />
      <span>{currentLocale === "en" ? "हिन्दी" : "English"}</span>
    </button>
  );
}
