"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import SectionCta from "./SectionCta";
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
  /** override the product image aspect ratio used by ProductCard */
  productRatio?: string;
  /** stretch tiles to fill the carousel height (image grows to fit) */
  fill?: boolean;
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
  productRatio,
  fill = false,
}: ProductCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  // Arrows sit at the middle of the product image, not the whole card.
  useEffect(() => {
    const image = ref.current?.querySelector<HTMLElement>("[data-card-image]");
    if (!image) return;
    const observer = new ResizeObserver(() =>
      setImageHeight(image.offsetHeight)
    );
    observer.observe(image);
    return () => observer.disconnect();
  }, [products]);

  const arrowStyle = imageHeight ? { top: imageHeight / 2 } : undefined;

  return (
    <div className={`min-w-0 ${fill ? "flex h-full flex-col" : ""}`}>
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      {ctaLabel && <SectionCta label={ctaLabel} href={ctaHref} />}

      <div className={`relative min-w-0 ${fill ? "flex-1 min-h-0" : ""}`}>
        <div
          ref={ref}
          className={`grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x ${
            fill ? "h-full items-stretch" : "items-start"
          } ${tileWidth} ${rows === 2 ? "grid-rows-2" : "grid-rows-1"}`}
        >
          {products.map((p) => (
            <div key={p.id} className={`snap-start ${fill ? "h-full" : ""}`}>
              <ProductCard
                product={p}
                compact={compact}
                ratio={productRatio}
                fill={fill}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="previous"
          style={arrowStyle}
          className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-light md:-left-3 md:bg-white"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="next"
          style={arrowStyle}
          className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur hover:bg-light md:-right-3 md:bg-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
