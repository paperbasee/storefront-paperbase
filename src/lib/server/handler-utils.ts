import "server-only";

import { NextResponse } from "next/server";

import { PaperbaseApiError } from "@/lib/api/paperbase-errors";

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(headerValue: string | null): string {
  if (!headerValue) {
    return "unknown";
  }
  return headerValue.split(",")[0]?.trim() || "unknown";
}

/**
 * Simple in-memory rate limit (best-effort; not suitable for multi-instance without shared store).
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { ok: true };
}

export function paperbaseErrorResponse(error: unknown) {
  if (error instanceof PaperbaseApiError) {
    return NextResponse.json(error.payload ?? { detail: error.message }, { status: error.status });
  }
  console.error("[api]", error);
  return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
}
