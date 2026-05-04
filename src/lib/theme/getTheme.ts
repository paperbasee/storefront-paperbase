import "server-only";

import { cache } from "react";

import { paperbaseGet } from "@/lib/server/paperbase";

export type StorefrontThemeSnippet = {
  card_variant?: string;
};

export const getStorefrontTheme = cache(async (): Promise<StorefrontThemeSnippet | null> => {
  try {
    return await paperbaseGet<StorefrontThemeSnippet>("theming/", {
      cache: "no-store",
    });
  } catch {
    return null;
  }
});
