import { apiFetchJson } from "@/lib/client/api";
import type { ProductDetail } from "@/types/product";

const DEFAULT_TTL_MS = 60_000;

type CacheEntry = {
  data: ProductDetail;
  fetchedAt: number;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ProductDetail>>();

/** Synchronous read for initial state (avoids loading flash when data is already cached). */
export function peekProductDetailCache(slug: string): ProductDetail | null {
  const hit = cache.get(slug);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) return null;
  return hit.data;
}

export function upsertProductDetailCache(slug: string, detail: ProductDetail, ttlMs = DEFAULT_TTL_MS): void {
  const now = Date.now();
  cache.set(slug, { data: detail, fetchedAt: now, expiresAt: now + ttlMs });
}

export function readProductDetailCacheEntry(slug: string): CacheEntry | null {
  return cache.get(slug) ?? null;
}

/**
 * Fetches product detail once per slug per session, dedupes concurrent calls,
 * and reuses cached JSON for checkout / variant pickers.
 */
export async function getProductDetailCached(slug: string): Promise<ProductDetail> {
  const hit = peekProductDetailCache(slug);
  if (hit) return hit;

  const pending = inflight.get(slug);
  if (pending) return pending;

  const promise = apiFetchJson<ProductDetail>(`/products/${slug}`)
    .then((data) => {
      upsertProductDetailCache(slug, data);
      inflight.delete(slug);
      return data;
    })
    .catch((err) => {
      inflight.delete(slug);
      throw err;
    });

  inflight.set(slug, promise);
  return promise;
}
