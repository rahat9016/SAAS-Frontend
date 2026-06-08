"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductTile from "./ProductTile";
import SectionHeader from "./SectionHeader";
import { HomeProduct } from "./homeTypes";

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: HomeProduct[];
  /** width of each tile (flow column width) */
  tileWidth?: string;
  /** number of stacked rows in the slider */
  rows?: 1 | 2;
  /** compact tiles (hide extra price info) */
  compact?: boolean;
}

/** Horizontal, snap-scrolling product slider (1 or 2 rows). */
export default function ProductCarousel({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  products,
  tileWidth = "auto-cols-[160px] sm:auto-cols-[180px]",
  rows = 1,
  compact = false,
}: ProductCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <div>
      {title && (
        <SectionHeader title={title} subtitle={subtitle} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      )}

      <div className="relative">
        <div
          ref={ref}
          className={`grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x ${tileWidth} ${
            rows === 2 ? "grid-rows-2" : "grid-rows-1"
          }`}
        >
          {products.map((p) => (
            <div key={p.id} className="snap-start">
              <ProductTile product={p} compact={compact} />
            </div>
          ))}
        </div>

        {/* Arrows (desktop) */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          className="absolute -left-3 top-1/2 -translate-y-1/2 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          className="absolute -right-3 top-1/2 -translate-y-1/2 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-light md:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
