import ProductTile from "./ProductTile";
import SectionHeader from "./SectionHeader";
import { HomeProduct } from "./homeTypes";

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: HomeProduct[];
  /** columns at lg breakpoint */
  cols?: 3 | 4 | 5 | 6;
}

const colClass: Record<number, string> = {
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
};

/** Responsive product grid. */
export default function ProductGrid({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  products,
  cols = 4,
}: ProductGridProps) {
  return (
    <div>
      {title && (
        <SectionHeader
          title={title}
          subtitle={subtitle}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
        />
      )}
      <div className={`grid gap-3 md:gap-4 ${colClass[cols]}`}>
        {products.map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
