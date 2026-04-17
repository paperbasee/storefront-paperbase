import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { pricingBreakdown } from "@/lib/server/paperbase";
import type { PaperbasePricingBreakdownRequest } from "@/types/paperbase";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`checkout:initiate:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  try {
    const body = (await request.json()) as PaperbasePricingBreakdownRequest & Record<string, unknown>;
    if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ detail: "items must be a non-empty array." }, { status: 400 });
    }
    const sanitised: PaperbasePricingBreakdownRequest = {
      items: body.items.map(({ product_public_id, variant_public_id, quantity }) => ({
        product_public_id,
        ...(variant_public_id ? { variant_public_id } : {}),
        quantity,
      })),
      ...(body.shipping_zone_public_id ? { shipping_zone_public_id: body.shipping_zone_public_id } : {}),
      ...(body.shipping_method_public_id ? { shipping_method_public_id: body.shipping_method_public_id } : {}),
    };
    const result = await pricingBreakdown(sanitised);
    return Response.json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ detail: "Invalid JSON body." }, { status: 400 });
    }
    return paperbaseErrorResponse(error);
  }
}
