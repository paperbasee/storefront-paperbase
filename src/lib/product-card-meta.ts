import type { Product } from "@/types/product";

export function getProductCardImageUrls(product: Product): string[] {
  const raw = product.extra_data?.card_gallery_urls;
  if (Array.isArray(raw)) {
    const urls = raw.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
    if (urls.length > 0) return urls;
  }
  const single = product.image_url?.trim();
  if (single) return [single];
  return ["/placeholders/hero.svg"];
}
