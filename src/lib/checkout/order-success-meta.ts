export type OrderSuccessMfsProvider = "bkash" | "nagad";

export type CheckoutSuccessPageMeta = {
  payment_method: "cod" | "mfs";
  mfs_provider?: OrderSuccessMfsProvider;
};

const META_PREFIX = "storefront-order-success-meta:";

function key(publicId: string) {
  return `${META_PREFIX}${publicId}`;
}

export function writeCheckoutSuccessMeta(publicId: string, meta: CheckoutSuccessPageMeta): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key(publicId), JSON.stringify(meta));
  } catch {
    /* quota / private mode */
  }
}

export function readCheckoutSuccessMeta(publicId: string): CheckoutSuccessPageMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key(publicId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CheckoutSuccessPageMeta;
    if (parsed.payment_method !== "cod" && parsed.payment_method !== "mfs") return null;
    if (parsed.mfs_provider != null && parsed.mfs_provider !== "bkash" && parsed.mfs_provider !== "nagad") {
      return { payment_method: parsed.payment_method };
    }
    return parsed;
  } catch {
    return null;
  }
}
