import Link from "next/link";
import FeatureBanner from "../common/FeatureBanner";
import ProductCarousel from "../common/ProductCarousel";
import { BannerContent, HomeProduct } from "../common/homeTypes";

interface BrandPromoRowProps {
  banner: BannerContent;
  products: HomeProduct[];
  /** banner on the left (default) or right */
  bannerSide?: "left" | "right";
  /** number of product rows beside the banner */
  rows?: 1 | 2;
}

export default function BrandPromoRow({
  banner,
  products,
  bannerSide = "left",
  rows = 1,
}: BrandPromoRowProps) {
  const title = banner.eyebrow ?? banner.title;
  const subtitle = banner.eyebrow ? banner.title : banner.subtitle;

  return (
    <section className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold leading-tight text-secondary md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-gray-500 md:text-lg">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <div
          className={`min-w-0 ${bannerSide === "right" ? "lg:order-2" : ""}`}
        >
          <FeatureBanner {...banner} ratio="aspect-[4/5] lg:aspect-[4/5]" />
        </div>
        <div className="relative flex min-w-0 flex-col lg:col-span-2">
          {banner.ctaHref && (
            <div className="absolute right-4 top-4 z-20 flex justify-end">
              <Link
                href={banner.ctaHref}
                className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-secondary shadow-sm backdrop-blur transition-colors hover:text-primary"
              >
                View all
              </Link>
            </div>
          )}
          <div className="min-h-0 flex-1">
            <ProductCarousel
              products={products}
              rows={rows}
              compact
              fill
              tileWidth="auto-cols-[80%] sm:auto-cols-[45%] lg:auto-cols-[40%]"
              productRatio="aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
