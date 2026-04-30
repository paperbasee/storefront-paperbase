"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { StorefrontLiveSearch } from "@/components/layout/storefront-live-search";

type DesktopSearchOverlayProps = {
  placeholder: string;
  openSearchAriaLabel: string;
  submitAriaLabel: string;
  closeLabel: string;
};

export function DesktopSearchOverlay({
  placeholder,
  openSearchAriaLabel,
  submitAriaLabel,
  closeLabel,
}: DesktopSearchOverlayProps) {
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={openSearchAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="hidden size-10 items-center justify-center rounded-md text-white transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/40 md:inline-flex"
      >
        <Search className="size-5" strokeWidth={1.9} aria-hidden />
      </button>

      {open && isClient
        ? createPortal(
            <div className="fixed inset-0 z-[120] hidden md:block" role="dialog" aria-modal="true" aria-label={openSearchAriaLabel}>
              <button
                type="button"
                aria-label={closeLabel}
                className="absolute inset-0 bg-transparent"
                onClick={() => setOpen(false)}
              />
              <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top,0px)+31px)] flex h-[140px] items-center justify-center border-y border-black/10 bg-[#e9e9e4]">
                <div className="mx-auto flex w-[min(64rem,calc(100%-3rem))] items-center justify-center gap-2">
                  <div className="w-[min(40rem,80vw)]">
                    <StorefrontLiveSearch
                      mode="desktop"
                      placeholder={placeholder}
                      submitAriaLabel={submitAriaLabel}
                      onAfterNavigate={() => setOpen(false)}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={closeLabel}
                    onClick={() => setOpen(false)}
                    className="inline-flex size-9 items-center justify-center rounded-md text-black/60 transition hover:bg-black/5 hover:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
