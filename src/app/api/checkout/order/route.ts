import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { createOrder } from "@/lib/server/paperbase";
import type { PaperbaseOrderCreateRequest } from "@/types/paperbase";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`checkout:order:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  try {
    const body = (await request.json()) as PaperbaseOrderCreateRequest;
    console.info("[checkout/order]", { ip });
    if (!body?.shipping_zone_public_id || !body.shipping_name || !body.phone || !body.shipping_address) {
      return Response.json({ detail: "Missing required order fields." }, { status: 400 });
    }
    if (!body.products || !Array.isArray(body.products) || body.products.length === 0) {
      return Response.json({ detail: "No products provided." }, { status: 400 });
    }
    const order = await createOrder(body);
    return Response.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ detail: "Invalid JSON body." }, { status: 400 });
    }
    return paperbaseErrorResponse(error);
  }
}
