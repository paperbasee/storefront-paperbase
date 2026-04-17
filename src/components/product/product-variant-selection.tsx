"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ProductVariant } from "@/types/product";

type OptionsByAttribute = Map<
  string,
  { attribute_name: string; values: Array<{ value_public_id: string; value: string }> }
>;

type VariantSelectionContextValue = {
  variants: ProductVariant[];
  selectedValues: Record<string, string>;
  setSelectedValue: (slug: string, valuePublicId: string) => void;
  selectedVariant: ProductVariant | undefined;
  optionsByAttribute: OptionsByAttribute;
};

const VariantSelectionContext = createContext<VariantSelectionContextValue | null>(null);

export function VariantSelectionProvider({
  variants,
  children,
}: {
  variants: ProductVariant[];
  children: ReactNode;
}) {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const optionsByAttribute = useMemo((): OptionsByAttribute => {
    const grouped: OptionsByAttribute = new Map();
    for (const variant of variants) {
      for (const option of variant.options) {
        const existing = grouped.get(option.attribute_slug);
        if (!existing) {
          grouped.set(option.attribute_slug, {
            attribute_name: option.attribute_name,
            values: [{ value_public_id: option.value_public_id, value: option.value }],
          });
          continue;
        }
        if (!existing.values.some((item) => item.value_public_id === option.value_public_id)) {
          existing.values.push({ value_public_id: option.value_public_id, value: option.value });
        }
      }
    }
    return grouped;
  }, [variants]);

  const selectedVariant = useMemo(() => {
    if (!variants.length || !Object.keys(selectedValues).length) {
      return undefined;
    }
    return variants.find((variant) =>
      variant.options.every((option) => selectedValues[option.attribute_slug] === option.value_public_id),
    );
  }, [selectedValues, variants]);

  useEffect(() => {
    if (variants.length !== 1) return;
    const initial: Record<string, string> = {};
    for (const opt of variants[0].options) {
      initial[opt.attribute_slug] = opt.value_public_id;
    }
    setSelectedValues(initial);
  }, [variants]);

  const setSelectedValue = useCallback((slug: string, valuePublicId: string) => {
    setSelectedValues((prev) => ({ ...prev, [slug]: valuePublicId }));
  }, []);

  const value = useMemo(
    () => ({
      variants,
      selectedValues,
      setSelectedValue,
      selectedVariant,
      optionsByAttribute,
    }),
    [variants, selectedValues, setSelectedValue, selectedVariant, optionsByAttribute],
  );

  return <VariantSelectionContext.Provider value={value}>{children}</VariantSelectionContext.Provider>;
}

export function useVariantSelection() {
  const ctx = useContext(VariantSelectionContext);
  if (!ctx) {
    throw new Error("useVariantSelection must be used within VariantSelectionProvider");
  }
  return ctx;
}
