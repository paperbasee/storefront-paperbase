"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { resolveStorefrontImageUrl, storefrontImageUnoptimized } from "@/lib/storefront-image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK = "/placeholders/hero.svg";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const tProduct = useTranslations("product");
  const [active, setActive] = useState(0);
  const [failedIndices, setFailedIndices] = useState<Record<number, true>>({});

  const safeImages = images.length > 0 ? images : [FALLBACK];
  const safeActive = Math.min(active, safeImages.length - 1);

  const getImageSrc = (src: string, index: number) =>
    failedIndices[index] ? FALLBACK : resolveStorefrontImageUrl(src);

  const handleError = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  const mainSrc = getImageSrc(safeImages[safeActive] ?? FALLBACK, safeActive);
  const mainUnoptimized = storefrontImageUnoptimized(mainSrc);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
      {/* Main image — first on mobile (stacked); right column on md+ */}
      <div className="relative order-1 min-w-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-neutral-100 md:order-2 md:flex-1">
        <div className="relative aspect-square w-full">
          <Image
            key={safeActive}
            src={mainSrc}
            alt={productName}
            fill
            priority
            loading="eager"
            unoptimized={mainUnoptimized}
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 48vw, 42vw"
            className="object-contain"
            onError={() => handleError(safeActive)}
          />
        </div>
      </div>

      {/* Thumbnails — horizontal strip under main on mobile; left column on md+ */}
      <ul
        className={cn(
          "order-2 m-0 flex w-full list-none flex-row gap-2 overflow-x-auto overflow-y-hidden px-0.5 py-1 [-webkit-overflow-scrolling:touch]",
          "md:order-1 md:w-[5rem] md:shrink-0 md:flex-col md:overflow-y-auto md:overflow-x-hidden",
        )}
        aria-label={tProduct("galleryAria")}
      >
        {safeImages.map((src, i) => {
          const active = i === safeActive;
          return (
            <li key={`thumb-${i}`} className="shrink-0 md:w-full">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={tProduct("viewImageAria", { index: i + 1 })}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group relative aspect-square shrink-0 cursor-pointer overflow-hidden rounded-lg bg-white transition-shadow duration-150",
                  "h-[4.25rem] w-[4.25rem] sm:h-[4.5rem] sm:w-[4.5rem] md:h-auto md:w-full",
                  active ? "shadow-md" : "shadow-sm",
                )}
              >
                {/* Clip image to rounded rect; stays under the frame overlay */}
                <span className="absolute inset-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={getImageSrc(src, i)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 72px, 80px"
                    unoptimized={storefrontImageUnoptimized(getImageSrc(src, i))}
                    className="object-contain"
                    onError={() => handleError(i)}
                  />
                </span>
                {/* Ring sits above the image so it is never covered */}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 z-[1] rounded-lg transition-shadow",
                    active
                      ? "ring-2 ring-inset ring-primary"
                      : "ring-1 ring-inset ring-neutral-200 group-hover:ring-neutral-300",
                  )}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
