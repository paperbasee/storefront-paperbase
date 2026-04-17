"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/hooks/useCart";
import { apiFetchJson } from "@/lib/client/api";
import { formatMoney, parseDecimal } from "@/lib/format";
import { triggerInitiateCheckout } from "@/lib/tracker";
import { cn } from "@/lib/utils";
import { Link, useRouter, type Locale } from "@/i18n/routing";
import type { PaperbaseShippingOption, PaperbaseShippingZone } from "@/types/paperbase";

import { CheckoutBreadcrumbs } from "./checkout-breadcrumbs";

const CHECKOUT_DRAFT_STORAGE_KEY = "paperbase-checkout-draft";

type CheckoutDraft = {
  shipping_zone_public_id: string;
  shipping_method_public_id?: string;
  shipping_name: string;
  phone: string;
  email?: string;
  shipping_address: string;
  district?: string;
  products: Array<{
    product_public_id: string;
    quantity: number;
    variant_public_id?: string;
  }>;
};

export function CheckoutShippingView() {
  const t = useTranslations("checkout");
  const tStates = useTranslations("states");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const { items, hydrated, subtotal, openCartPanel } = useCart();
  const [zones, setZones] = useState<Array<{ zone_public_id: string; name: string }>>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [methods, setMethods] = useState<
    Array<{ method_public_id: string; method_name: string; price: string; estimated?: string }>
  >([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [shippingCost, setShippingCost] = useState("0.00");
  const [finalTotal, setFinalTotal] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        product_public_id: item.product_public_id,
        variant_public_id: item.variant_public_id,
        quantity: item.quantity,
      })),
    [items],
  );

  useEffect(() => {
    if (!hydrated || items.length === 0) {
      return;
    }
    triggerInitiateCheckout(items);
  }, [hydrated, items]);

  useEffect(() => {
    let mounted = true;
    async function loadZones() {
      if (!hydrated || items.length === 0) {
        return;
      }
      try {
        const response = await apiFetchJson<PaperbaseShippingZone[]>("/checkout/shipping/zones");
        if (!mounted) return;
        const activeZones = response
          .filter((zone) => zone.is_active)
          .map((zone) => ({ zone_public_id: zone.zone_public_id, name: zone.name }));
        setZones(activeZones);
        if (activeZones[0]) {
          setSelectedZone(activeZones[0].zone_public_id);
        }
      } catch {
        if (!mounted) return;
        setErrorText("Failed to load shipping zones.");
      }
    }
    loadZones();
    return () => {
      mounted = false;
    };
  }, [hydrated, items.length]);

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      if (!selectedZone) {
        return;
      }
      setLoading(true);
      setErrorText(null);
      try {
        const options = await apiFetchJson<PaperbaseShippingOption[]>(
          `/checkout/shipping/options?zone_public_id=${encodeURIComponent(selectedZone)}`,
        );
        if (!mounted) return;
        const mapped = options.map((option) => ({
          method_public_id: option.method_public_id,
          method_name: option.method_name,
          price: option.price,
        }));
        setMethods(mapped);
        setSelectedMethod((current) => current || mapped[0]?.method_public_id || "");
      } catch {
        if (!mounted) return;
        setErrorText("Failed to load shipping methods.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadOptions();
    return () => {
      mounted = false;
    };
  }, [selectedZone]);

  useEffect(() => {
    let mounted = true;
    async function loadPricing() {
      if (!cartItems.length) {
        return;
      }
      try {
        const response = await apiFetchJson<{
          shipping_cost: string;
          final_total: string;
        }>("/checkout/initiate", {
          method: "POST",
          body: JSON.stringify({
            items: cartItems,
            shipping_zone_public_id: selectedZone || undefined,
            shipping_method_public_id: selectedMethod || undefined,
          }),
        });
        if (!mounted) return;
        setShippingCost(response.shipping_cost);
        setFinalTotal(response.final_total);
      } catch {
        if (!mounted) return;
        setErrorText("Failed to calculate pricing.");
      }
    }
    loadPricing();
    return () => {
      mounted = false;
    };
  }, [cartItems, selectedMethod, selectedZone]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) {
      return;
    }
    if (!selectedZone) {
      setErrorText("Please choose a shipping zone.");
      return;
    }
    const formData = new FormData(form);
    const shipping_name = `${String(formData.get("firstName") || "").trim()} ${String(
      formData.get("lastName") || "",
    ).trim()}`.trim();
    const phone = String(formData.get("phone") || "").trim();
    const shipping_address = String(formData.get("shippingAddress") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const district = String(formData.get("district") || "").trim();

    const draft: CheckoutDraft = {
      shipping_zone_public_id: selectedZone,
      shipping_method_public_id: selectedMethod || undefined,
      shipping_name,
      phone,
      email: email || undefined,
      shipping_address,
      district: district || undefined,
      products: cartItems,
    };
    window.sessionStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    router.push("/checkout/payment");
  }

  if (!hydrated) {
    return (
      <div className="bg-white py-16 text-center text-sm text-text/70">{tStates("loading")}</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="mb-6 text-text/80">{t("empty")}</p>
        <Link
          href="/#products"
          className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const selectedMethodObject = methods.find((method) => method.method_public_id === selectedMethod);
  const displayShipping = selectedMethodObject ? selectedMethodObject.price : shippingCost;

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-text outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-w-0 max-w-full bg-white pb-12 pt-6 md:pb-16 md:pt-8">
      <CheckoutBreadcrumbs step="shipping" onOpenCart={openCartPanel} />

      <form
        onSubmit={handleSubmit}
        className="grid w-full min-w-0 max-w-full gap-8 lg:grid-cols-[minmax(0,1fr)_min(380px,100%)] lg:items-start"
      >
        <div className="min-w-0 space-y-8">
          <section className="min-w-0 rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <h1 className="mb-6 text-lg font-semibold text-text">{t("shippingAddress")}</h1>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("firstName")}*</span>
                  <input className={inputClass} name="firstName" required autoComplete="given-name" />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("lastName")}*</span>
                  <input className={inputClass} name="lastName" required autoComplete="family-name" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("email")}*</span>
                  <input
                    className={inputClass}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                  />
                </label>
                <div className="grid min-w-0 gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("phone")}*</span>
                  <div className="flex min-w-0 gap-2">
                    <input type="hidden" name="dial" value="+880" />
                    <span
                      className={cn(
                        inputClass,
                        "inline-flex max-w-[7.5rem] shrink-0 cursor-default select-none items-center text-neutral-700 sm:max-w-[8.5rem]",
                      )}
                    >
                      {t("dialOption_bd")}
                    </span>
                    <input
                      className={cn(inputClass, "min-w-0 flex-1")}
                      name="phone"
                      type="tel"
                      required
                      pattern="01[0-9]{9}"
                      maxLength={11}
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-label={`${t("dialOption_bd")} ${t("phone")}`}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("city")}*</span>
                  <input className={inputClass} name="city" required autoComplete="address-level2" />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">{t("state")}*</span>
                  <input className={inputClass} name="district" required autoComplete="address-level1" />
                </label>
              </div>
              <div className="grid gap-4">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium text-text">Shipping address*</span>
                  <textarea className={inputClass} name="shippingAddress" rows={3} required />
                </label>
              </div>
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <h2 className="mb-4 text-lg font-semibold text-text">Shipping Zone</h2>
            <select
              className={inputClass}
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              required
            >
              {zones.map((zone) => (
                <option key={zone.zone_public_id} value={zone.zone_public_id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </section>

          <section className="min-w-0 rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm sm:p-6 md:p-8">
            <h2 className="mb-4 text-lg font-semibold text-text">{t("shippingMethod")}</h2>
            <fieldset className="grid min-w-0 gap-3 sm:grid-cols-2">
              <legend className="sr-only">{t("shippingMethod")}</legend>
              {methods.map((opt) => {
                const selected = selectedMethod === opt.method_public_id;
                return (
                  <label
                    key={opt.method_public_id}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-start gap-2 rounded-lg border p-3 transition-colors sm:gap-3 sm:p-4",
                      selected ? "border-text bg-white ring-1 ring-text" : "border-neutral-200 hover:border-neutral-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={opt.method_public_id}
                      checked={selected}
                      onChange={() => setSelectedMethod(opt.method_public_id)}
                      className="mt-1 size-4 shrink-0 accent-text"
                    />
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block break-words font-medium text-text">{opt.method_name}</span>
                      <span className="break-words text-sm text-neutral-500">{opt.method_name}</span>
                    </span>
                    <span className="price-display-line shrink-0 text-base whitespace-nowrap sm:text-lg">
                      {formatMoney(opt.price, locale)}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </section>
          {errorText ? <p className="text-sm text-red-600">{errorText}</p> : null}
        </div>

        <aside className="min-w-0 w-full max-w-full rounded-lg border border-neutral-200/60 bg-white p-4 shadow-sm sm:p-6 md:p-8">
          <h2 className="mb-5 text-lg font-semibold text-text">{t("summaryTitle")}</h2>
          <ul className="mb-4 max-h-[min(360px,50vh)] space-y-4 overflow-x-hidden overflow-y-auto pe-1">
            {items.map((item) => (
              <li
                key={`${item.product_public_id}-${item.variant_public_id ?? "default"}`}
                className="flex min-w-0 gap-2 sm:gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                  <Image
                    src={item.image_url ?? "/placeholders/hero.svg"}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                  <span className="absolute left-1 top-1 flex size-5 items-center justify-center rounded-md bg-text text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="break-words text-sm font-medium leading-snug text-text">{item.name}</p>
                </div>
                <p className="price-display-line max-w-[45%] shrink-0 text-end break-all sm:max-w-none sm:whitespace-nowrap">
                  {formatMoney(parseDecimal(item.price) * item.quantity, locale)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="min-w-0 space-y-3 border-t border-neutral-200 pt-5 text-base">
            <div className="flex min-w-0 items-baseline justify-between gap-3 text-neutral-600 sm:gap-4">
              <dt className="min-w-0 shrink break-words font-medium">{t("subtotal")}</dt>
              <dd className="price-display-summary shrink-0 text-end break-all">
                {formatMoney(subtotal, locale)}
              </dd>
            </div>
            <div className="flex min-w-0 items-baseline justify-between gap-3 text-neutral-600 sm:gap-4">
              <dt className="min-w-0 shrink break-words font-medium">{t("shippingLine")}</dt>
              <dd className="price-display-summary shrink-0 text-end break-all">
                {formatMoney(displayShipping, locale)}
              </dd>
            </div>
            <div className="flex min-w-0 items-end justify-between gap-3 border-t border-neutral-200 pt-4 sm:gap-4">
              <dt className="price-display-eyebrow-neutral">{t("total")}</dt>
              <dd className="price-display-total shrink-0 text-end leading-none">
                {formatMoney(finalTotal, locale)}
              </dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
          >
            {t("continueToPayment")}
          </button>
        </aside>
      </form>
    </div>
  );
}
