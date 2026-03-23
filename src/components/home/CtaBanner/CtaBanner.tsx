"use client";

import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ctaBanners = [
  {
    id: 1,
    image: "/banners/cta-1.png",
    alt: "Premium furniture collection",
    badge: "57%",
    badgeText: "Offer",
    title: "Join now & earn 5% rewards on every order.",
    price: "$340.00",
    comparePrice: "$460.00",
    buyLink: "/shop",
    collectionLink: "/shop",
    dark: true,
  },
  {
    id: 2,
    image: "/banners/cta-2.png",
    alt: "Athletic shoes collection",
    badge: "",
    badgeText: "",
    title: "The new tech pack for men.",
    price: "$340.00",
    comparePrice: "",
    buyLink: "/shop",
    collectionLink: "/shop",
    dark: false,
  },
  {
    id: 3,
    image: "/banners/cta-3.png",
    alt: "Performance shoes",
    badge: "57%",
    badgeText: "Offer",
    title: "Join now & earn 5% rewards on every order.",
    price: "$340.00",
    comparePrice: "$460.00",
    buyLink: "/shop",
    collectionLink: "/shop",
    dark: true,
  },
];

export default function CtaBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % ctaBanners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + ctaBanners.length) % ctaBanners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="w-full relative overflow-hidden group py-8">
      <div className="relative w-full aspect-16/6 sm:aspect-16/5 lg:aspect-[16/4.5]">
        {ctaBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex justify-end">
                <div className="max-w-sm sm:max-w-md">
                  {/* Offer Badge */}
                  {banner.badge && (
                    <div className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full bg-red-500 flex flex-col items-center justify-center text-white shadow-lg mb-4 sm:mb-5">
                      <span className="text-base sm:text-xl font-extrabold leading-none">{banner.badge}</span>
                      <span className="text-[9px] sm:text-[11px] font-medium -mt-0.5">{banner.badgeText}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className={`text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-snug mb-4 sm:mb-5 drop-shadow-md ${banner.dark ? "text-white" : "text-gray-900"}`}>
                    {banner.title}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-5 sm:mb-7">
                    <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${banner.dark ? "text-white" : "text-gray-900"}`}>
                      {banner.price}
                    </span>
                    {banner.comparePrice && (
                      <span className={`text-sm sm:text-base line-through ${banner.dark ? "text-white/50" : "text-gray-400"}`}>
                        {banner.comparePrice}
                      </span>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                      href={banner.buyLink}
                      className={`inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors no-underline text-white ${
                        banner.dark
                          ? "bg-amber-700 hover:bg-amber-800"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <ShoppingCart size={15} />
                      Buy Now
                    </Link>
                    <Link
                      href={banner.collectionLink}
                      className={`inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 border-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors no-underline ${
                        banner.dark
                          ? "border-white/70 text-white hover:bg-white/10"
                          : "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                      }`}
                    >
                      View Collections
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {ctaBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === current
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
