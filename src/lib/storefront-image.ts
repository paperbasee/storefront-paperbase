const PLACEHOLDER = "/placeholders/hero.svg";

/**
 * Resolves cart / product image URLs for the browser.
 * Paperbase often returns host-relative paths (e.g. `/media/...`) which must be loaded from the API origin, not the Next.js host.
 */
export function resolveStorefrontImageUrl(url: string | null | undefined): string {
  const raw = url?.trim();
  if (!raw) {
    return PLACEHOLDER;
  }
  if (raw.startsWith("//")) {
    return `https:${raw}`;
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  if (raw.startsWith("/")) {
    if (raw.startsWith("/placeholders/")) {
      return raw;
    }
    const base = process.env.NEXT_PUBLIC_PAPERBASE_BACKEND_ORIGIN?.replace(/\/+$/, "");
    if (base) {
      return `${base}${raw}`;
    }
    return PLACEHOLDER;
  }
  return raw;
}

/** Keep unoptimized only for schemes unsupported by the optimizer proxy. */
export function storefrontImageUnoptimized(resolvedUrl: string): boolean {
  const value = resolvedUrl.trim().toLowerCase();
  if (!value) {
    return true;
  }
  // Keep optimizer off only for schemes Next/Image optimizer cannot proxy.
  return value.startsWith("data:") || value.startsWith("blob:");
}
