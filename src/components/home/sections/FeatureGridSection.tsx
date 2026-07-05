import FeatureBanner from "../common/FeatureBanner";
import ProductCarousel from "../common/ProductCarousel";
import { BannerContent, HomeProduct } from "../common/homeTypes";

interface FeatureGridSectionProps {
  banner: BannerContent;
  products: HomeProduct[];
}

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
      <ProductCarousel
        products={products}
        tileWidth="auto-cols-[70%] sm:auto-cols-[45%] lg:auto-cols-[calc((100%-1.5rem)/3)] 2xl:auto-cols-[calc((100%-1.5rem)/4)]"
      />
    </section>
  );
}
