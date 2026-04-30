import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/server/handler-utils";
import { getServerPaperbaseConfig } from "@/lib/server/config";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`invoice:status:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const { publicId } = await context.params;
  if (!publicId) {
    return Response.json({ detail: "Missing order id." }, { status: 400 });
  }

  const { baseUrl, publishableKey } = getServerPaperbaseConfig();
  const upstream = await fetch(`${baseUrl}orders/${publicId}/invoice/status/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${publishableKey}`,
    },
    cache: "no-store",
  });

  const payload = await upstream.text();
  return new Response(payload || "{}", {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
