import { IProduct } from "@/src/types/ecommerce/product";
import { HomeProduct } from "./homeTypes";

/**
 * Normalise a real `IProduct` (redux/dummy data) into the presentational
 * `HomeProduct` shape consumed by the single reusable `ProductCard` card.
 */
export function toHomeProduct(p: IProduct): HomeProduct {
  const primary = p.images.find((img) => img.isPrimary) ?? p.images[0];
  const hasDiscount = !!p.compareAtPrice && p.compareAtPrice > p.price;
  const discountPercent = hasDiscount
    ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)
    : 0;

  return {
    id: p.id,
    slug: p.slug,
    image: primary?.url ?? "",
    brand: p.brand?.name ?? "",
    name: p.name,
    price: p.price,
    originalPrice: hasDiscount ? p.compareAtPrice : undefined,
    lastLowest: hasDiscount ? p.compareAtPrice : undefined,
    lastLowestLabel: hasDiscount ? `-${discountPercent}%` : undefined,
    extraLabel: p.isNewArrival ? "New" : p.isSustainable ? "Sustainable" : undefined,
    deal: hasDiscount,
    href: `/products/${p.slug}`,
  };
}
