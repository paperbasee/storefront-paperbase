import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { getStorePublic } from "@/lib/server/paperbase";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`store:public:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  try {
    const store = await getStorePublic();
    return new Response(JSON.stringify(store), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        Vary: "Authorization",
      },
    });
  } catch (error) {
    return paperbaseErrorResponse(error);
  }
}
