/**
 * sessionStorage key for the shipping-step checkout draft consumed by the payment step.
 */
export const CHECKOUT_DRAFT_STORAGE_KEY = "storefront-checkout-draft";

/**
 * localStorage key for the last MFS checkout order `public_id` (`ord_...`), set when
 * the user continues from the payment stub so refresh / back navigation can recover the id.
 */
export const MFS_PENDING_ORDER_PUBLIC_ID_KEY = "storefront-mfs-pending-order-public-id";

export function readMfsPendingOrderPublicId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(MFS_PENDING_ORDER_PUBLIC_ID_KEY);
    return v && v.startsWith("ord_") ? v : null;
  } catch {
    return null;
  }
}

export function writeMfsPendingOrderPublicId(publicId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MFS_PENDING_ORDER_PUBLIC_ID_KEY, publicId);
  } catch {
    /* quota / private mode */
  }
}

export function clearMfsPendingOrderPublicId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MFS_PENDING_ORDER_PUBLIC_ID_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * sessionStorage key for the resolved prepayment type for the pending order.
 * Value is one of `ProductPrepaymentType` ("none" | "delivery_only" | "full").
 *
 * Captured at shipping-submit time so the payment step reflects the actual items
 * being ordered even after the Buy Now session map is cleared.
 */
export const CHECKOUT_PREPAYMENT_STORAGE_KEY = "storefront-checkout-prepayment";

export type CheckoutMfsSuccessProvider = "bkash" | "nagad";

/** @deprecated One-shot handoff to `/checkout/payment` — migrated on payment page load to `/success/[orderId]`. */
export const LEGACY_CHECKOUT_SUCCESS_HANDOFF_KEY = "storefront-checkout-success-handoff";
