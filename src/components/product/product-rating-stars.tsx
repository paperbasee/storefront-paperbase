import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

function StarSlot({ fill, className }: { fill: number; className?: string }) {
  const f = Math.min(1, Math.max(0, fill));
  if (f >= 1) {
    return <Star className={cn("size-[1.05rem] fill-rating text-rating", className)} strokeWidth={0} aria-hidden />;
  }
  if (f <= 0) {
    return <Star className={cn("size-[1.05rem] text-neutral-300", className)} fill="none" aria-hidden />;
  }
  return (
    <span className={cn("relative inline-block size-[1.05rem]", className)}>
      <Star className="size-[1.05rem] text-neutral-300" fill="none" aria-hidden />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${f * 100}%` }}>
        <Star className="size-[1.05rem] fill-rating text-rating" strokeWidth={0} aria-hidden />
      </span>
    </span>
  );
}

type ProductRatingStarsProps = {
  rating: number;
  className?: string;
};

export function ProductRatingStars({ rating, className }: ProductRatingStarsProps) {
  const clamped = Math.min(5, Math.max(0, rating));
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <StarSlot key={i} fill={clamped - i} />
      ))}
    </div>
  );
}
