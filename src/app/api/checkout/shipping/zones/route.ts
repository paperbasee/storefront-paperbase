import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { getShippingZones } from "@/lib/server/paperbase";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`checkout:zones:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  try {
    const zones = await getShippingZones();
    return new Response(JSON.stringify(zones), {
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
