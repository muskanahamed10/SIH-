import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { ReactQueryProvider } from "@/components/providers/query-provider";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Official Statistical System | AI-Enabled Competency & Learning Gap Platform",
  description: "Ministry of Statistics and Programme Implementation (MoSPI) - SIH 2026 Problem Statement 101",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  const isHindi = locale === "hi";

  return (
    <html lang={locale} dir="ltr" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body
        className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 ${
          isHindi ? "font-devanagari" : "font-sans"
        }`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
