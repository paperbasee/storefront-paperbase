"use client";

import { useRouter } from "@/i18n/routing";

type HeaderSearchProps = {
  placeholder: string;
  submitAriaLabel: string;
};

export function HeaderSearch({ placeholder, submitAriaLabel }: HeaderSearchProps) {
  const router = useRouter();

  return (
    <form
      role="search"
      className="flex w-full items-center rounded-full border border-black/5 bg-white py-1 pl-4 pr-1 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = String(formData.get("q") || "").trim();
        router.push(`/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      }}
    >
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-9 min-w-0 flex-1 border-none bg-transparent py-2 text-sm text-text outline-none placeholder:text-text/45"
      />
      <button
        type="submit"
        aria-label={submitAriaLabel}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[18px]"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
