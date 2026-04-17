type TrackerShape = {
  initiateCheckout: (cart: unknown) => void;
  purchase?: (payload: unknown) => void;
};

declare global {
  interface Window {
    tracker?: TrackerShape;
    PAPERBASE_PUBLISHABLE_KEY?: string;
  }
}

/**
 * Paperbase `tracker.js` handles Pixel + ingest; do not add custom `fbq` or CAPI.
 * Publishable key is set once from the server-rendered layout script.
 */
export function triggerInitiateCheckout(cart: unknown) {
  if (typeof window === "undefined") return;
  window.tracker?.initiateCheckout(cart);
}

export function triggerPurchase(payload: unknown) {
  if (typeof window === "undefined") return;
  window.tracker?.purchase?.(payload);
}
