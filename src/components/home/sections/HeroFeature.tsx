import FeatureBanner from "../common/FeatureBanner";
import ProductCard from "../common/ProductCard";
import { BannerContent, HomeProduct } from "../common/homeTypes";

interface HeroFeatureProps {
  banner: BannerContent;
  products: HomeProduct[];
}

/** Hero: full-width banner + a row of featured product thumbnails beneath it. */
export default function HeroFeature({ banner, products }: HeroFeatureProps) {
  return (
    <section className="space-y-6">
      {/* Full-bleed banner (no rounding, edge to edge) */}
      <FeatureBanner
        {...banner}
        ratio="aspect-[16/7] md:aspect-[16/6]"
        className="rounded-none"
        contained
        large
      />

      {/* Thumbnails aligned to the page container */}
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 5).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
