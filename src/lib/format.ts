import type { Locale } from "@/i18n/routing";

const currencyByLocale: Record<Locale, string> = {
  en: "USD",
  bn: "BDT",
};

export function formatPrice(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
    style: "currency",
    currency: currencyByLocale[locale],
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseDecimal(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value: string | number, locale: Locale, currency = "BDT") {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(parseDecimal(value));
}
