import FeatureBanner from "../common/FeatureBanner";
import ProductGrid from "../common/ProductGrid";
import { BannerContent, HomeProduct } from "../common/homeTypes";

interface FeatureGridSectionProps {
  banner: BannerContent;
  products: HomeProduct[];
  cols?: 3 | 4;
}

/** Wide feature banner above a product grid (e.g. "Nike Style By Moon Shoe"). */
export default function FeatureGridSection({
  banner,
  products,
  cols = 4,
}: FeatureGridSectionProps) {
  return (
    <section className="space-y-4">
      <FeatureBanner {...banner} ratio="aspect-[16/6]" align="center" />
      <ProductGrid products={products} cols={cols} />
    </section>
  );
}
