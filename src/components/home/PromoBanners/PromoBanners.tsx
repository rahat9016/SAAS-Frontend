import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const promoBanners = [
  {
    id: "coats",
    tag: "Clearance",
    title: "Winter Coats",
    subtitle: "up to 50% off",
    btnText: "Shop Now",
    href: "/products?category=coats",
    image: "/banners/promo-coats.png",
    gridClass: "col-start-1 row-span-2 min-h-[280px] lg:min-h-0",
  },
  {
    id: "menswear",
    tag: "On Sale",
    title: "Men's Collection",
    subtitle: "from ৳1,999",
    btnText: "Discover Now",
    href: "/products?category=menswear",
    image: "/banners/promo-menswear.png",
    gridClass: "col-start-1 sm:col-start-2 row-span-1 sm:row-span-2 min-h-[220px] sm:min-h-[280px] lg:min-h-0",
  },
  {
    id: "accessories",
    tag: "New Arrivals",
    title: "Bags & Accessories",
    subtitle: "",
    btnText: "Discover Now",
    href: "/products?category=accessories",
    image: "/banners/promo-accessories.png",
    gridClass: "col-start-1 sm:col-start-1 lg:col-start-3 min-h-[220px] sm:min-h-[240px] lg:min-h-0",
  },
  {
    id: "shoes",
    tag: "On Sale",
    title: "Shoes Offer",
    subtitle: "up to 30% off",
    btnText: "Shop Now",
    href: "/products?category=shoes",
    image: "/banners/promo-shoes.png",
    gridClass: "col-start-1 sm:col-start-2 lg:col-start-3 min-h-[220px] sm:min-h-[240px] lg:min-h-0",
  },
];

export default function PromoBanners() {
  return (
    <section className="py-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 sm:gap-4 lg:h-[480px]">
          {promoBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className={`group relative rounded-xl overflow-hidden cursor-pointer ${banner.gridClass}`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-br from-black/45 to-black/10 z-1" />
              <div className="relative z-2 flex flex-col justify-end h-full p-4 sm:p-6 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-widest opacity-85 mb-1">
                  {banner.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-bold leading-tight mb-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-sm opacity-90 mb-3">{banner.subtitle}</p>
                )}
                <span className="inline-flex items-center gap-1.5 w-fit px-4 py-2 rounded-md bg-white text-gray-900 text-xs font-semibold hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all">
                  {banner.btnText} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
