import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { combinedSearch } from "@/lib/server/paperbase";

/**
 * Proxies storefront combined search (`GET /api/v1/search/`) for live typeahead.
 * Query: `q` (min 2 chars on upstream; shorter returns empty payload) or `trending=1|true|yes`.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`storefront:search:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const url = request.nextUrl;
  const trendingParam = url.searchParams.get("trending");
  const trending =
    trendingParam === "1" || trendingParam === "true" || trendingParam === "yes";

  try {
    if (trending) {
      const data = await combinedSearch({ trending: "1" });
      return Response.json(data);
    }

    const q = url.searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) {
      return Response.json({
        products: [],
        categories: [],
        suggestions: [],
        trending: false,
      });
    }

    const data = await combinedSearch({ q });
    return Response.json(data);
  } catch (error) {
    return paperbaseErrorResponse(error);
  }
}
