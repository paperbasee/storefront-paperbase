import { NextRequest } from "next/server";

import { checkRateLimit, getClientIp, paperbaseErrorResponse } from "@/lib/server/handler-utils";
import { createSupportTicketJson, createSupportTicketMultipart } from "@/lib/server/paperbase";
import type { PaperbaseSupportTicketRequest } from "@/types/paperbase";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const limited = checkRateLimit(`support:tickets:${ip}`, 20, 60_000);
  if (!limited.ok) {
    return new Response(null, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const ticket = await createSupportTicketMultipart(formData);
      return Response.json(ticket, { status: 201 });
    }

    const body = (await request.json()) as PaperbaseSupportTicketRequest;
    if (!body?.name || !body.email || !body.message) {
      return Response.json({ detail: "name, email, and message are required." }, { status: 400 });
    }
    const ticket = await createSupportTicketJson(body);
    return Response.json(ticket, { status: 201 });
  } catch (error) {
    return paperbaseErrorResponse(error);
  }
}
