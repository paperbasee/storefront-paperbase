import { PaperbaseApiError } from "@/lib/api/paperbase-errors";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

/**
 * Same-origin (or configured base) fetch to internal App Router `/api/*` routes.
 * Do not call Paperbase directly from client components.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = apiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}/api${normalizedPath}`;

  const headers = new Headers(init?.headers);
  const body = init?.body;
  if (body != null && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...init,
    headers,
  });
}

export async function apiFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = { detail: text || res.statusText };
  }
  if (!res.ok) {
    throw new PaperbaseApiError("API request failed", res.status, data as Record<string, unknown>);
  }
  return data as T;
}
