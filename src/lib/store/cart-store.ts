"use client";

import { create } from "zustand";

import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "sarar-global-cart";

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  cartPanelOpen: boolean;
  openCartPanel: () => void;
  closeCartPanel: () => void;
  hydrateCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productPublicId: string, variantPublicId?: string) => void;
  increment: (productPublicId: string, variantPublicId?: string) => void;
  decrement: (productPublicId: string, variantPublicId?: string) => void;
  clear: () => void;
};

function getItemKey(productPublicId: string, variantPublicId?: string) {
  return `${productPublicId}::${variantPublicId ?? "default"}`;
}

function persistItems(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  hydrated: false,
  cartPanelOpen: false,
  openCartPanel: () => set({ cartPanelOpen: true }),
  closeCartPanel: () => set({ cartPanelOpen: false }),
  hydrateCart: () => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    try {
      const parsed = stored ? (JSON.parse(stored) as CartItem[]) : [];
      set({ items: parsed, hydrated: true });
    } catch {
      persistItems([]);
      set({ items: [], hydrated: true });
    }
  },
  addItem: (item, quantity = 1) => {
    const safeQuantity = Math.max(1, quantity);
    const nextItems = [...get().items];
    const key = getItemKey(item.product_public_id, item.variant_public_id);
    const existingIndex = nextItems.findIndex(
      (entry) => getItemKey(entry.product_public_id, entry.variant_public_id) === key,
    );

    if (existingIndex >= 0) {
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + safeQuantity,
      };
    } else {
      nextItems.push({
        ...item,
        quantity: safeQuantity,
      });
    }

    persistItems(nextItems);
    set({ items: nextItems });
  },
  removeItem: (productPublicId, variantPublicId) => {
    const nextItems = get().items.filter(
      (entry) =>
        getItemKey(entry.product_public_id, entry.variant_public_id) !==
        getItemKey(productPublicId, variantPublicId),
    );
    persistItems(nextItems);
    set({ items: nextItems });
  },
  increment: (productPublicId, variantPublicId) => {
    const nextItems = get().items.map((entry) => {
      if (
        getItemKey(entry.product_public_id, entry.variant_public_id) ===
        getItemKey(productPublicId, variantPublicId)
      ) {
        return {
          ...entry,
          quantity: entry.quantity + 1,
        };
      }

      return entry;
    });

    persistItems(nextItems);
    set({ items: nextItems });
  },
  decrement: (productPublicId, variantPublicId) => {
    const nextItems = get()
      .items.map((entry) => {
        if (
          getItemKey(entry.product_public_id, entry.variant_public_id) ===
          getItemKey(productPublicId, variantPublicId)
        ) {
          return {
            ...entry,
            quantity: Math.max(0, entry.quantity - 1),
          };
        }

        return entry;
      })
      .filter((entry) => entry.quantity > 0);

    persistItems(nextItems);
    set({ items: nextItems });
  },
  clear: () => {
    persistItems([]);
    set({ items: [] });
  },
}));
