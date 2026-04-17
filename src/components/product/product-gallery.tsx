"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  /** When set, shows a sale badge on the main image (e.g. 15 for “-15%”) */
  discountPercent?: number | null;
};

export function ProductGallery({ images, productName, discountPercent }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : ["/vercel.svg"];
  const mainSrc = safeImages[Math.min(active, safeImages.length - 1)] ?? safeImages[0];

  return (
    <div className="flex gap-3 sm:gap-4 lg:gap-6">
      <div className="flex w-[4.25rem] shrink-0 flex-col gap-2 overflow-y-auto pb-1 sm:w-[4.5rem]">
        {safeImages.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              "relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border bg-white transition-colors",
              i === active ? "border-2 border-violet-600" : "border border-neutral-200 hover:border-neutral-300",
            )}
          >
            <Image src={src} alt="" fill sizes="72px" className="object-contain p-1.5" />
          </button>
        ))}
      </div>
      <div className="relative min-h-[280px] flex-1 bg-white sm:min-h-[360px] lg:min-h-[420px]">
        {discountPercent != null && discountPercent > 0 ? (
          <div className="absolute start-3 top-3 z-10 rounded-md bg-[#e31d1d] px-2 py-1 text-xs font-bold text-white shadow-sm">
            -{discountPercent}%
          </div>
        ) : null}
        <div className="relative aspect-square w-full">
          <Image
            src={mainSrc}
            alt={productName}
            fill
            priority
            sizes="(max-width: 640px) 75vw, (max-width: 1024px) 45vw, 40vw"
            className="object-contain p-6 sm:p-8 lg:p-10"
          />
        </div>
      </div>
    </div>
  );
}
