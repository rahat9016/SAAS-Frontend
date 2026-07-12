import ProductCarousel from "../common/ProductCarousel";
import SectionCta from "../common/SectionCta";
import SectionHeader from "../common/SectionHeader";
import { HomeProduct } from "../common/homeTypes";

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: HomeProduct[];
  /** number of stacked rows in the carousel */
  rows?: 1 | 2;
}

/** Centered header + horizontal product carousel. The only product section on home. */
export default function ProductCarouselSection({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  products,
  rows = 1,
}: ProductCarouselSectionProps) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />
      {ctaLabel && <SectionCta label={ctaLabel} href={ctaHref} />}
      <ProductCarousel
        products={products}
        rows={rows}
        tileWidth="auto-cols-[70%] sm:auto-cols-[45%] lg:auto-cols-[calc((100%-2.25rem)/4)]"
      />
    </section>
  );
}
