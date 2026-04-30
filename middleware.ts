import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_SET = new Set(routing.locales);

function resolveBackendBaseUrl(): string | null {
  const origin =
    process.env.PAPERBASE_BACKEND_ORIGIN ??
    (process.env.PAPERBASE_API_URL?.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") ?? "");
  return origin ? `${origin.replace(/\/+$/, "")}/api/v1` : null;
}

async function resolveStoreLocale(): Promise<string | null> {
  const baseUrl = resolveBackendBaseUrl();
  const publishableKey = process.env.PAPERBASE_PUBLISHABLE_KEY;
  if (!baseUrl || !publishableKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${baseUrl}/store/public/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${publishableKey}` },
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => {
      clearTimeout(timeout);
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { language?: string };
    const locale = (data.language || "").toLowerCase();
    return LOCALE_SET.has(locale) ? locale : "en";
  } catch (error) {
    console.error("[i18n] Failed to resolve store locale in middleware.", error);
    return null;
  }
}

function redirectToLocale(request: NextRequest, locale: string, suffix = "") {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${suffix}`;
  return NextResponse.redirect(url);
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const storeLocale = await resolveStoreLocale();
  if (!storeLocale) {
    return intlMiddleware(request);
  }

  if (pathname === "/") {
    return redirectToLocale(request, storeLocale);
  }

  const localeMatch = pathname.match(/^\/(en|bn)(\/.*)?$/);
  if (localeMatch) {
    const currentLocale = localeMatch[1];
    const suffix = localeMatch[2] || "";
    if (currentLocale !== storeLocale) {
      return redirectToLocale(request, storeLocale, suffix);
    }
    return intlMiddleware(request);
  }

  return redirectToLocale(request, storeLocale, pathname);
}

export const config = {
  matcher: ["/", "/(en|bn)/:path*", "/((?!api|_next|.*\\..*).*)"],
};
