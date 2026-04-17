import type { Locale } from "@/i18n/routing";

const currencyByLocale: Record<Locale, string> = {
  en: "USD",
  bn: "BDT",
};

export function formatPrice(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
    style: "currency",
    currency: currencyByLocale[locale],
    currencyDisplay: "narrowSymbol",
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

const moneyFormatterOptions = (currency: string) =>
  ({
    style: "currency" as const,
    currency,
    currencyDisplay: "narrowSymbol" as const,
    maximumFractionDigits: 2,
  }) satisfies Intl.NumberFormatOptions;

export function formatMoney(value: string | number, locale: Locale, currency = "BDT") {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", moneyFormatterOptions(currency)).format(
    parseDecimal(value),
  );
}

/** Same output as `formatMoney`, split for styling (e.g. bold currency symbol). */
export function formatMoneyParts(
  value: string | number,
  locale: Locale,
  currency = "BDT",
): Intl.NumberFormatPart[] {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", moneyFormatterOptions(currency)).formatToParts(
    parseDecimal(value),
  );
}
