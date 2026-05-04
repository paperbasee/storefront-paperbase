"use client";

import { useTheme } from "./ThemeContext";

export function useCardVariant(): string {
  const theme = useTheme();
  return theme?.card_variant ?? "classic";
}
