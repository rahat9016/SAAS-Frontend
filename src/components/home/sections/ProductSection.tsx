import ProductCarousel from "../common/ProductCarousel";
import SectionHeader from "../common/SectionHeader";
import { HomeProduct } from "../common/homeTypes";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: HomeProduct[];
  /** number of stacked rows in the carousel */
  rows?: 1 | 2;
}

/** Centered header + horizontal product carousel. The only product section on home. */
export default function ProductSection({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  products,
  rows = 1,
}: ProductSectionProps) {
  return (
    <section>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
      <ProductCarousel
        products={products}
        rows={rows}
        tileWidth="auto-cols-[70%] sm:auto-cols-[45%] lg:auto-cols-[calc((100%-2.25rem)/4)]"
      />
    </section>
  );
}
