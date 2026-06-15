import {
  Backpack,
  Crown,
  Droplet,
  Flag,
  Footprints,
  Gem,
  Home,
  Layers,
  Mountain,
  Package,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Tag,
  Watch,
  Wind,
  type LucideIcon,
} from "lucide-react";

export interface MegaItem {
  label: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export interface MegaColumn {
  heading: string;
  items: MegaItem[];
}

export interface MegaMenuData {
  columns: MegaColumn[];
  promo: { image: string; label: string; href: string };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Pair = [string, LucideIcon];

const item = ([label, icon]: Pair): MegaItem => ({
  label,
  href: `/categories?c=${slug(label)}`,
  icon,
});

// Shared subcategory groups (same set under every category).
const TOPS: Pair[] = [
  ["Blouses", Shirt],
  ["Shirts", Shirt],
  ["T-shirts", Shirt],
  ["Polo shirts", Shirt],
  ["Sweatshirts", Shirt],
  ["Sweatshirt Jacke", Layers],
  ["Indoor jackets", Shirt],
  ["Indoor Blazer", Layers],
  ["Indoor-Sakko", Layers],
  ["Indoor-Weste", Layers],
];

const OUTDOOR: Pair[] = [
  ["Outdoor jackets", Mountain],
  ["Outdoor-Coat", Snowflake],
  ["Outdoor-Weste", Layers],
  ["Outdoor-Poncho", Wind],
  ["Outdoor-Umhang", Wind],
  ["Knitwear", Snowflake],
  ["Knitted sweater", Snowflake],
  ["Knitted Vest", Layers],
  ["Knitted cardigan", Snowflake],
  ["Knitted twinset", Sparkles],
];

const BOTTOMS: Pair[] = [
  ["Pants", Tag],
  ["Jeans pants", Tag],
  ["Skirts", Tag],
  ["One-pieces/dresses", Shirt],
  ["Underwear", Package],
  ["Swimwear", Droplet],
  ["Accessories", Watch],
  ["Socks/Hosiery", Footprints],
  ["Daywear", Sparkles],
  ["Hats", Crown],
];

const SPECIALS: Pair[] = [
  ["Curtains", Home],
  ["Home Cloths", Home],
  ["Shoes", Footprints],
  ["Fine Jewelry", Gem],
  ["Fashion Jewelry", Sparkles],
  ["Bags", ShoppingBag],
  ["Fragrances", Droplet],
  ["Flags", Flag],
  ["Religious", Crown],
  ["Traditionals", Backpack],
];

const SHARED_MENU: MegaMenuData = {
  columns: [
    { heading: "Tops", items: TOPS.map(item) },
    { heading: "Outdoor & Knitwear", items: OUTDOOR.map(item) },
    { heading: "Bottoms & More", items: BOTTOMS.map(item) },
    { heading: "Home & Specials", items: SPECIALS.map(item) },
  ],
  promo: {
    image: "https://picsum.photos/seed/familie-munshi/520/360",
    label: "NEW SEASON EDIT",
    href: "/products?h=new-season",
  },
};

export const defaultMegaMenu: MegaMenuData = SHARED_MENU;

/** Every nav label shares the same subcategory menu. */
export function getMegaMenu(label: string): MegaMenuData {
  void label;
  return SHARED_MENU;
}
