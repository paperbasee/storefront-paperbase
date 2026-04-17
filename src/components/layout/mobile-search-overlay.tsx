"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { useRouter } from "@/i18n/routing";

type MobileSearchOverlayProps = {
  placeholder: string;
  openSearchAriaLabel: string;
  submitAriaLabel: string;
  closeLabel: string;
};

export function MobileSearchOverlay({
  placeholder,
  openSearchAriaLabel,
  submitAriaLabel,
  closeLabel,
}: MobileSearchOverlayProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openSearchAriaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full min-w-0 items-center rounded-full border border-black/5 bg-white py-1 pl-4 pr-1 text-start shadow-sm transition hover:bg-neutral-50"
      >
        <span className="min-h-9 min-w-0 flex-1 truncate py-2 text-sm text-text/45">{placeholder}</span>
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
          aria-hidden
        >
          <Search className="size-[18px]" strokeWidth={2} />
        </span>
      </button>

      {open && isClient
        ? createPortal(
            <div
              className="fixed inset-0 z-[110] flex flex-col bg-neutral-100 pt-[env(safe-area-inset-top,0px)] md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label={openSearchAriaLabel}
            >
              <div className="flex justify-end px-3 pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={closeLabel}
                  className="flex size-11 items-center justify-center rounded-full text-text transition hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <X className="size-6" strokeWidth={2} aria-hidden />
                </button>
              </div>

              <div className="px-4 pt-1">
                <form
                  role="search"
                  className="relative flex items-center rounded-full border border-violet-200 bg-white py-1 pl-4 pr-2 shadow-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = String(formData.get("q") || "").trim();
                    router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
                    setOpen(false);
                  }}
                >
                  <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    placeholder={placeholder}
                    autoComplete="off"
                    enterKeyHint="search"
                    className="min-h-11 min-w-0 flex-1 border-none bg-transparent py-2 pe-10 text-sm text-text outline-none placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    aria-label={submitAriaLabel}
                    className="absolute end-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-text transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Search className="size-[18px]" strokeWidth={2} aria-hidden />
                  </button>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
