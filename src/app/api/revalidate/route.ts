import { timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function timingSafeSecretMatch(expected: string, received: string | null): boolean {
  const a = Buffer.from(expected, "utf8");
  if (received === null) {
    return false;
  }
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function POST(request: Request): Promise<NextResponse> {
  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ detail: "Could not read body" }, { status: 400 });
  }

  const secret = process.env.REVALIDATE_SECRET;
  if (secret === undefined || secret === "") {
    console.error("[revalidate] missing_REVALIDATE_SECRET");
    return NextResponse.json({ detail: "Revalidation is not configured" }, { status: 500 });
  }

  const headerSecret = request.headers.get("x-webhook-secret");
  if (!timingSafeSecretMatch(secret, headerSecret)) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ detail: "Malformed payload" }, { status: 400 });
  }

  const rawPath = body.path;
  const rawPaths = body.paths;

  const paths: string[] = [];

  if (typeof rawPath === "string" && rawPath.trim() !== "") {
    paths.push(rawPath.trim());
  }

  if (Array.isArray(rawPaths)) {
    for (const item of rawPaths) {
      if (typeof item === "string" && item.trim() !== "") {
        paths.push(item.trim());
      }
    }
  }

  if (paths.length === 0) {
    return NextResponse.json({ detail: "Malformed payload" }, { status: 400 });
  }

  try {
    for (const path of paths) {
      revalidatePath(path);
    }
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    console.error("[revalidate] unexpected_error", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ detail: "Revalidation failed" }, { status: 500 });
  }
}
