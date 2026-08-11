import { dummyProducts } from "@/src/data/dummyProducts";
import { IBrand } from "../types";

// Sourced from the storefront's own product catalog (dummyProducts.ts)
// so admin brand list stays in sync with the brands shoppers actually see.
const brandDescriptions: Record<string, string> = {
  levis: "Denim heritage label — jeans, jackets and workwear staples.",
  zara: "Fast-fashion womenswear and menswear, refreshed weekly.",
  nike: "Performance sportswear, footwear and training gear.",
  adidas: "Athletic apparel, sneakers and streetwear collaborations.",
  hm: "Affordable everyday basics and seasonal trend pieces.",
  uniqlo: "Japanese LifeWear — functional fabrics and minimal design.",
  "ralph-lauren": "Premium American classics and tailored essentials.",
};

export const mockBrandsList: IBrand[] = Array.from(
  new Map(
    dummyProducts
      .filter((product) => product.brand)
      .map((product) => [product.brand!.id, product.brand!])
  ).values()
)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((brand, index) => ({
    id: brand.id,
    name: brand.name,
    description:
      brandDescriptions[brand.slug] ?? `${brand.name} branded collection.`,
    status: index % 5 === 4 ? "INACTIVE" : "ACTIVE",
    createdAt: `2026-0${(index % 9) + 1}-12`,
  }));
