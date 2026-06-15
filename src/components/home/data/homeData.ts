// Mock data for the home page sections. Swap with real API data later —
// every section component is props-driven, so only this file changes.

import { dummyProducts } from "@/src/data/dummyProducts";
import { BannerContent, BoardItem, BrandStory, HomeProduct } from "../common/homeTypes";

/** Real catalog slugs so product tiles open an actual detail page. */
const PRODUCT_SLUGS = dummyProducts.map((p) => p.slug);

// Curated Unsplash clothing/fashion photo IDs (apparel, models, shoes, bags).
const FASHION_IDS = [
  "1483985988355-763728e1935b",
  "1490481651871-ab68de25d43d",
  "1539109136881-3be0616acf4b",
  "1521572163474-6864f9cf17ab",
  "1542291026-7eec264c27ff",
  "1485462537746-965f33f7f6a7",
  "1556905055-8f358a7a47b2",
  "1551232864-3f0890e580d9",
  "1525507119028-ed4c629a60a3",
  "1503342217505-b0a15ec3261c",
  "1485231183945-fffde7cc051e",
  "1434389677669-e08b4cac3105",
  "1487222477894-8943e31ef7b2",
  "1495121605193-b116b5b9c5fe",
  "1490114538077-0a7f8cb49891",
  "1469334031218-e382a71b716b",
  "1441984904996-e0b6ba687e04",
  "1462392246754-28dfa2df8e6b",
  "1487412720507-e7ab37603c6f",
  "1473966968600-fa801b869a1a",
];

/** Clothing image from the curated pool. */
const fashion = (i: number, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${FASHION_IDS[i % FASHION_IDS.length]}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "COACH", "Mango", "Tommy"];

const NAMES = [
  "BERMUDA - Shorts - olive",
  "Summer linen shirt - sand",
  "Relaxed denim - mid blue",
  "Knit polo - cream",
  "Pleated midi skirt - black",
  "Oversized tee - white",
  "Cargo trousers - khaki",
  "Striped sweat shorts - teal",
];

/** Generate a row of mock clothing products. */
export function makeProducts(prefix: string, n = 10): HomeProduct[] {
  const offset = prefix.length; // vary the image start per section
  return Array.from({ length: n }, (_, i) => {
    const original = 40 + ((i * 9) % 60); // RRP
    const price = Math.round(original * 0.55 * 100) / 100; // current "from"
    const lastLowest = Math.round((price + 2.4) * 100) / 100;
    const off = 5 + ((i * 3) % 20);
    return {
      id: `${prefix}-${i}`,
      image: fashion(offset + i),
      brand: BRANDS[i % BRANDS.length],
      name: NAMES[i % NAMES.length],
      price,
      originalPrice: original,
      lastLowest,
      lastLowestLabel: `-${off}%`,
      extraLabel: i % 2 === 0 ? "15% EXTRA" : undefined,
      deal: i % 3 === 0,
      href: `/products/${PRODUCT_SLUGS[(offset + i) % PRODUCT_SLUGS.length]}`,
    };
  });
}

export const heroBanner: BannerContent = {
  image:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  eyebrow: "Summer wardrobe",
  title: "Step into summer style",
  subtitle: "Dresses, denim and more — ready for warmer days",
  ctaLabel: "Shop now",
  ctaHref: "/products",
  theme: "light",
};

export const brandStories: BrandStory[] = [
  "Vans", "Clarks", "Puma", "Nike", "Adidas", "COACH", "Levi's", "Zara", "Mango", "Tommy",
].map((b, i) => ({
  id: `story-${i}`,
  image: fashion(i + 2),
  title: b,
  subtitle: "Fresh drop",
  href: "/brands",
}));

export const nikeBanner: BannerContent = {
  image:
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&h=600&q=80",
  eyebrow: "Nike Style",
  title: "One shoe, endless looks",
  subtitle: "Iconic silhouettes reimagined for summer",
  ctaLabel: "Discover",
  ctaHref: "/products",
  theme: "light",
};

export const boards: BoardItem[] = [
  "Beach days", "City breaks", "Festival", "Workwear", "Date night",
  "Weekend", "Gym", "Holiday", "Office", "Night out",
].map((t, i) => ({ id: `board-${i}`, image: fashion(i + 5), title: t, href: "/products" }));

export const philipsBanner: BannerContent = {
  image: fashion(7, 800, 1000),
  eyebrow: "Summer Deals",
  title: "Your Summer Glow-Up Starts Here",
  ctaLabel: "Shop now",
  ctaHref: "/products",
  theme: "light",
};

export const weightlessBanner: BannerContent = {
  image:
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&h=600&q=80",
  eyebrow: "Weightless icons",
  title: "Fresh summer sneakers",
  subtitle: "Featherlight styles built for warm days",
  ctaLabel: "Shop now",
  ctaHref: "/products",
  theme: "light",
};

/** The repeating brand promo blocks. */
export const brandPromos: { banner: BannerContent; products: HomeProduct[]; bannerSide?: "left" | "right" }[] = [
  {
    banner: { image: fashion(1, 800, 1000), eyebrow: "Tommy Jeans", title: "Festival season", ctaLabel: "Shop now", ctaHref: "/products" },
    products: makeProducts("tommy"),
  },
  {
    banner: { image: fashion(6, 800, 1000), eyebrow: "COACH", title: "A Tabby for everyone", ctaLabel: "Explore", ctaHref: "/products" },
    products: makeProducts("coach"),
    bannerSide: "right",
  },
  {
    banner: { image: fashion(9, 800, 1000), eyebrow: "Seasalt Cornwall", title: "Effortless UK coast style", ctaLabel: "Shop now", ctaHref: "/products" },
    products: makeProducts("seasalt"),
  },
  {
    banner: { image: fashion(13, 800, 1000), eyebrow: "Columbia", title: "One Trail. Two Tales.", ctaLabel: "Explore", ctaHref: "/products" },
    products: makeProducts("columbia"),
    bannerSide: "right",
  },
  {
    banner: { image: fashion(16, 800, 1000), eyebrow: "Tezenis", title: "Swimwear", ctaLabel: "Shop now", ctaHref: "/products" },
    products: makeProducts("tezenis"),
  },
  {
    banner: { image: fashion(18, 800, 1000), eyebrow: "Calvin Klein", title: "Feels Like Summer", ctaLabel: "Shop now", ctaHref: "/products" },
    products: makeProducts("ck"),
    bannerSide: "right",
  },
];

export const outfitLooks: BoardItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: `look-${i}`,
  image: fashion(i, 540, 960),
  title: "Snap their style",
  href: "/products",
}));
