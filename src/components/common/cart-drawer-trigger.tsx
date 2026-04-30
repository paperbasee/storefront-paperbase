"use client";

import dynamic from "next/dynamic";
import { ShoppingCart, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
          ? "h-10 w-10 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-white hover:bg-white/10 hover:text-white md:hidden [&_svg]:text-white"
          : "cursor-pointer border-0 bg-transparent p-2 text-white hover:bg-white/10 hover:text-white [&_svg]:text-white"
      }
    >
      <span className="relative inline-flex">
        <ShoppingCart className="size-[26px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] translate-x-px -translate-y-px items-center justify-center rounded-sm bg-danger px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
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

/** Mobile-only scroll-to-top FAB; appears above the cart button when scrolled down (hidden from md up). */
export function MobileScrollToTopButton() {
  const tCommon = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={tCommon("scrollToTop")}
      className="fixed z-40 flex size-12 items-center justify-center rounded-full border border-white/15 bg-header text-white shadow-lg transition-all duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 md:hidden"
      style={{
        bottom: "calc(max(1rem, env(safe-area-inset-bottom, 0px)) + 3.75rem + 0.625rem)",
        right: "calc(max(1rem, env(safe-area-inset-right, 0px)) + 0.25rem)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <ArrowUp className="size-5 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );
}

/** Mobile-only FAB; opens the same cart drawer as header cart (hidden from md up). */
export function MobileFloatingCartButton() {
  const t = useTranslations("nav");
  const openCartPanel = useCartStore((s) => s.openCartPanel);
  const { itemCount } = useCart();

  return (
    <button
      type="button"
      onClick={() => openCartPanel()}
      aria-label={t("cart")}
      className="fixed z-40 flex size-14 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-header text-white shadow-lg transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 md:hidden [&_svg]:text-white"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <span className="relative inline-flex">
        <ShoppingCart className="size-7 shrink-0" strokeWidth={2} aria-hidden />
        <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-sm bg-danger px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      </span>
    </button>
  );
}
