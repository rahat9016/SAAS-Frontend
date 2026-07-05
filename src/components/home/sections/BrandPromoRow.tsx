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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
        <div
          className={`min-w-0 ${bannerSide === "right" ? "lg:order-2" : ""}`}
        >
          <FeatureBanner {...banner} ratio="aspect-[4/5] lg:aspect-[4/5]" />
        </div>
        <div className="relative min-w-0 lg:col-span-2">
          {banner.ctaHref && (
            <div className="absolute right-0 top-0 z-10 flex justify-end">
              <Link
                href={banner.ctaHref}
                className="text-sm font-semibold text-secondary underline underline-offset-4 transition-colors hover:text-primary"
              >
                View all
              </Link>
            </div>
          )}
          <div className="pt-0">
            <ProductCarousel
              products={products}
              rows={rows}
              compact
              tileWidth="auto-cols-[80%] sm:auto-cols-[45%] lg:auto-cols-[calc((100%-1.5rem)/3)]"
              productRatio="aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
