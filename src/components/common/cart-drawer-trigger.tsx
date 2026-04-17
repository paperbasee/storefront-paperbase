"use client";

import dynamic from "next/dynamic";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

const CartPanel = dynamic(
  () => import("@/components/common/cart-panel").then((mod) => mod.CartPanel),
  { ssr: false },
);

export function CartPanelHost() {
  const open = useCartStore((s) => s.cartPanelOpen);
  const closeCartPanel = useCartStore((s) => s.closeCartPanel);

  return <CartPanel open={open} onClose={closeCartPanel} />;
}

type CartTriggerProps = {
  variant: "mobile" | "desktop";
};

export function CartTrigger({ variant }: CartTriggerProps) {
  const t = useTranslations("nav");
  const openCartPanel = useCartStore((s) => s.openCartPanel);
  const { itemCount } = useCart();

  const button = (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openCartPanel()}
      aria-label={t("cart")}
      className={
        variant === "mobile"
          ? "h-10 w-10 shrink-0 border-0 bg-transparent p-0 text-white hover:bg-white/10 md:hidden"
          : "border-0 bg-transparent p-2 text-white hover:bg-white/10"
      }
    >
      <span className="relative inline-flex">
        <ShoppingCart className="size-[26px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] translate-x-px -translate-y-px items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </span>
    </Button>
  );

  if (variant === "mobile") {
    return button;
  }

  return <div className="hidden md:contents">{button}</div>;
}
