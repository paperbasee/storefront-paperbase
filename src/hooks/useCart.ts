"use client";

import { useEffect, useMemo } from "react";

import { parseDecimal } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartStore((state) => state.hydrated);
  const hydrateCart = useCartStore((state) => state.hydrateCart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const clear = useCartStore((state) => state.clear);
  const openCartPanel = useCartStore((state) => state.openCartPanel);

  useEffect(() => {
    if (!hydrated) {
      hydrateCart();
    }
  }, [hydrateCart, hydrated]);

  const metrics = useMemo(() => {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + parseDecimal(item.price) * item.quantity, 0);

    return {
      itemCount,
      subtotal,
    };
  }, [items]);

  return {
    items,
    hydrated,
    addItem,
    removeItem,
    increment,
    decrement,
    clear,
    openCartPanel,
    ...metrics,
  };
}
