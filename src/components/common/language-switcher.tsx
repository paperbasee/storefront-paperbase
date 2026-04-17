"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { routing, type Locale, usePathname, useRouter } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <label className="relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white">
      <Languages className="pointer-events-none size-[24px]" strokeWidth={1.75} aria-hidden />
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value as Locale)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={t("language")}
      >
        {routing.locales.map((nextLocale) => (
          <option key={nextLocale} value={nextLocale} className="bg-header text-white">
            {nextLocale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
