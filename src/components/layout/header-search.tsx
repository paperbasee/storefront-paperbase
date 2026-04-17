"use client";

import { StorefrontLiveSearch } from "@/components/layout/storefront-live-search";

type HeaderSearchProps = {
  placeholder: string;
  submitAriaLabel: string;
};

export function HeaderSearch({ placeholder, submitAriaLabel }: HeaderSearchProps) {
  return <StorefrontLiveSearch mode="desktop" placeholder={placeholder} submitAriaLabel={submitAriaLabel} />;
}
