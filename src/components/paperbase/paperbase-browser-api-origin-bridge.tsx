import Script from "next/script";

import {
  getBrowserPaperbaseBackendOrigin,
  PAPERBASE_PRODUCTION_API_ORIGIN,
} from "@/lib/paperbase-public";

/**
 * Rewrites browser `fetch` to Paperbase production so hosted `tracker.js`
 * hits `NEXT_PUBLIC_PAPERBASE_BACKEND_ORIGIN` (e.g. http://localhost:8000).
 */
export function PaperbaseBrowserApiOriginBridge() {
  const origin = getBrowserPaperbaseBackendOrigin();
  if (!origin) {
    return null;
  }

  const cfg = JSON.stringify({
    production: PAPERBASE_PRODUCTION_API_ORIGIN,
    rewrite: origin,
  });

  return (
    <Script
      id="paperbase-browser-api-origin-bridge"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(() => {
  var cfg = ${cfg};
  if (typeof window === "undefined" || window.__paperbaseFetchPatched) return;
  window.__paperbaseFetchPatched = true;
  var p = cfg.production;
  var r = String(cfg.rewrite || "");
  if (!r || !p) return;
  var orig = window.fetch;
  if (typeof orig !== "function") return;
  window.fetch = function (input, init) {
    var u =
      typeof input === "string"
        ? input
        : typeof Request !== "undefined" && input instanceof Request
          ? input.url
          : "";
    if (!u || u.indexOf(p) !== 0) {
      return orig.call(this, input, init);
    }
    var nextUrl = r + u.slice(p.length);
    if (typeof input === "string") {
      return orig.call(this, nextUrl, init);
    }
    if (typeof Request !== "undefined" && input instanceof Request) {
      return orig.call(this, new Request(nextUrl, input), init);
    }
    return orig.call(this, nextUrl, init);
  };
})();`,
      }}
    />
  );
}
