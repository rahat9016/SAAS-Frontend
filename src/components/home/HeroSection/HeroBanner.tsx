"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    image: "https://picsum.photos/seed/banner1/900/400",
    alt: "Deal of the Day",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/banner2/900/400",
    alt: "New Arrivals",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/banner3/900/400",
    alt: "Super Sale",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 group">
      {/* Slides */}
      <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 70vw"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
