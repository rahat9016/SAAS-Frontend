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

/**
 * The repeating brand block: a tall promo banner beside a horizontal
 * product slider (defaults to 2 rows) with its own header. Data-driven so
 * every brand reuses it.
 */
export default function BrandPromoRow({
  banner,
  products,
  bannerSide = "left",
  rows = 2,
}: BrandPromoRowProps) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className={`min-w-0 ${bannerSide === "right" ? "lg:order-2" : ""}`}>
        <FeatureBanner {...banner} ratio="aspect-[4/5] lg:h-full" />
      </div>
      <div className="min-w-0 lg:col-span-2 lg:self-center">
        <ProductCarousel
          title={banner.eyebrow ?? banner.title}
          subtitle={banner.eyebrow ? banner.title : banner.subtitle}
          ctaLabel="View all"
          ctaHref={banner.ctaHref}
          products={products}
          rows={rows}
          compact
          tileWidth="auto-cols-[170px] sm:auto-cols-[200px]"
        />
      </div>
    </section>
  );
}
