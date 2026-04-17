"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

type AccountNavLinkProps = {
  variant: "mobile" | "desktop";
};

/** Stub account entry (no auth yet); matches cart trigger sizing on mobile/desktop. */
export function AccountNavLink({ variant }: AccountNavLinkProps) {
  const t = useTranslations("nav");

  const link = (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label={t("account")}
      className={
        variant === "mobile"
          ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 md:hidden"
          : "inline-flex items-center justify-center rounded-lg border-0 bg-transparent p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      }
    >
      <UserRound className="size-[26px] shrink-0" strokeWidth={1.75} aria-hidden />
    </a>
  );

  if (variant === "mobile") {
    return link;
  }

  return <div className="hidden md:contents">{link}</div>;
}
