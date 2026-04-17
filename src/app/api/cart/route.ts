import { NextRequest } from "next/server";

/**
 * Paperbase has no server cart API. Cart remains client-side (localStorage).
 * This route exists for future extensions (e.g. server-side validation snapshots).
 */
export async function GET() {
  return Response.json({ ok: true, note: "Cart is managed client-side per Paperbase storefront contract." });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ detail: "Expected JSON object body." }, { status: 400 });
    }
    return Response.json({ ok: true, received: true });
  } catch {
    return Response.json({ detail: "Invalid request." }, { status: 400 });
  }
}
