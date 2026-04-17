/** Production API host baked into Paperbase `tracker.js` (browser). */
export const PAPERBASE_PRODUCTION_API_ORIGIN = "https://api.paperbase.me";

/**
 * When set, the layout injects a small `beforeInteractive` fetch shim so
 * `tracker.js` calls to {@link PAPERBASE_PRODUCTION_API_ORIGIN} go to this
 * origin instead (e.g. local Django). Must mirror {@link PAPERBASE_BACKEND_ORIGIN}
 * for local dev. Server-only env vars are not visible to `tracker.js`.
 */
export function getBrowserPaperbaseBackendOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_PAPERBASE_BACKEND_ORIGIN?.trim();
  if (!raw) {
    return null;
  }
  const normalized = raw.replace(/\/+$/, "");
  if (normalized === PAPERBASE_PRODUCTION_API_ORIGIN) {
    return null;
  }
  return normalized;
}
