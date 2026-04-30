import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp } from "@/lib/server/handler-utils";
import { getServerPaperbaseConfig } from "@/lib/server/config";

type RouteContext = {
  params: Promise<{ publicId: string }>;
};

type InvoiceReadyResponse = {
  ready?: boolean;
  url?: string;
  detail?: string;
  message?: string;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`invoice:download:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const { publicId } = await context.params;
  if (!publicId) {
    return Response.json({ detail: "Missing order id." }, { status: 400 });
  }

  const { baseUrl, publishableKey } = getServerPaperbaseConfig();
  const readinessRes = await fetch(`${baseUrl}orders/${publicId}/invoice/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${publishableKey}`,
    },
    cache: "no-store",
  });

  const readinessText = await readinessRes.text();
  const readiness = (readinessText ? JSON.parse(readinessText) : {}) as InvoiceReadyResponse;
  if (!readinessRes.ok || !readiness.ready || !readiness.url) {
    return Response.json(
      readinessText ? readiness : { detail: "Invoice not ready yet." },
      { status: readinessRes.status === 200 ? 409 : readinessRes.status },
    );
  }

  const fileRes = await fetch(readiness.url, { method: "GET", cache: "no-store" });
  if (!fileRes.ok) {
    return Response.json({ detail: "Failed to fetch invoice file." }, { status: 502 });
  }

  const bytes = await fileRes.arrayBuffer();
  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": fileRes.headers.get("content-type") || "application/pdf",
      "Content-Disposition": `attachment; filename="invoice_${publicId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
