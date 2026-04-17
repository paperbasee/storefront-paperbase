import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { getShippingOptions } from "@/lib/server/paperbase";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`checkout:options:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const zone_public_id = request.nextUrl.searchParams.get("zone_public_id") ?? "";
  if (!zone_public_id) {
    return Response.json({ detail: "zone_public_id is required." }, { status: 400 });
  }

  const order_total = request.nextUrl.searchParams.get("order_total") ?? undefined;

  try {
    const options = await getShippingOptions(zone_public_id, order_total);
    return Response.json(options);
  } catch (error) {
    return paperbaseErrorResponse(error);
  }
}
