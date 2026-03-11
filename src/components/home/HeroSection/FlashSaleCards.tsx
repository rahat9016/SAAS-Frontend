"use client";

import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const flashSales = [
  {
    id: 1,
    title: "FLASH SALE",
    discount: "DISCOUNT UPTO 60%",
    image: "https://picsum.photos/seed/flashshoe/300/200",
    href: "/products?filter=flash-sale",
    gradient: "from-red-500 to-red-700",
  },
  {
    id: 2,
    title: "FLASH SALE",
    discount: "DISCOUNT UPTO 60%",
    image: "https://picsum.photos/seed/flashbag/300/200",
    href: "/products?filter=flash-sale",
    gradient: "from-teal-500 to-teal-700",
  },
];

export default function FlashSaleCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mt-3 lg:mt-4">
      {flashSales.map((sale) => (
        <Link
          key={sale.id}
          href={sale.href}
          className="relative group overflow-hidden rounded-lg h-32 sm:h-36 lg:h-40"
        >
          {/* Background image */}
          <Image
            src={sale.image}
            alt={sale.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 50vw"
          />

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${sale.gradient} opacity-80`}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-between px-5 sm:px-6">
            <div className="text-white">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap size={12} className="fill-yellow-300 text-yellow-300" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-90">
                  {sale.discount}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                {sale.title}
              </h3>
              <span className="inline-block mt-2 text-[10px] sm:text-xs font-medium bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 group-hover:bg-white/30 transition-colors">
                Shop Now →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
