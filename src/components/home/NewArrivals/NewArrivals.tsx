"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import ProductCard from "../ProductCard/ProductCard";

export default function NewArrivals() {
  const products = dummyProducts.filter((p) => p.isActive && p.isNewArrival);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [leftPad, setLeftPad] = useState(16);

  const measurePad = useCallback(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setLeftPad(rect.left);
    }
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    measurePad();
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", () => {
      checkScroll();
      measurePad();
    });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", measurePad);
    };
  }, [checkScroll, measurePad]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 220;
    const amount = cardWidth * 2 + 16;
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-8 lg:py-12 bg-primary/10">
      <div className="container" ref={headerRef}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles size={22} className="text-violet-500" />
              New Arrivals
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Just dropped — fresh finds for you
            </p>
          </div>
          <Link
            href="/products?sort=newest"
            className="group flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="relative group/scroll">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{
            paddingLeft: `${leftPad}px`,
            paddingRight: "2rem",
            scrollbarWidth: "none",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0"
              style={{ width: "clamp(170px, 18vw, 230px)" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 text-foreground hover:bg-gray-50 transition-all cursor-pointer"
            style={{ left: `${Math.max(leftPad - 20, 8)}px` }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 text-foreground hover:bg-gray-50 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </section>
  );
}
