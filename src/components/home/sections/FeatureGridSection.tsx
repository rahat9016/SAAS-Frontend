import FeatureBanner from "../common/FeatureBanner";
import ProductCarousel from "../common/ProductCarousel";
import { BannerContent, HomeProduct } from "../common/homeTypes";

interface FeatureGridSectionProps {
  banner: BannerContent;
  products: HomeProduct[];
}

/** Wide feature banner above a horizontal product slider (e.g. "Nike Style"). */
export default function FeatureGridSection({
  banner,
  products,
}: FeatureGridSectionProps) {
  return (
    <section className="space-y-4">
      <FeatureBanner
        {...banner}
        ratio="aspect-[4/3] sm:aspect-[16/7] lg:aspect-[16/6]"
        align="center"
      />
      <ProductCarousel products={products} />
    </section>
  );
}
