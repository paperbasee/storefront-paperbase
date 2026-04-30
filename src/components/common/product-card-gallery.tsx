import Image from "next/image";

import { Link } from "@/i18n/routing";
import { storefrontImageUnoptimized } from "@/lib/storefront-image";

type ProductCardGalleryProps = {
  urls: string[];
  alt: string;
  href: string;
  priority?: boolean;
};

export function ProductCardGallery({ urls, alt, href, priority }: ProductCardGalleryProps) {
  const src =
    urls.find((u) => typeof u === "string" && u.trim().length > 0)?.trim() ?? "/placeholders/hero.svg";
  const unoptimized = storefrontImageUnoptimized(src);

  return (
    <div className="relative aspect-square w-full shrink-0 border border-neutral-200 bg-transparent">
      <Link
        href={href}
        className="relative block size-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900/15"
        aria-label={alt}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain object-center"
          unoptimized={unoptimized}
          priority={priority}
          loading={priority ? "eager" : undefined}
        />
      </Link>
    </div>
  );
}
