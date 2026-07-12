import {
  Baby,
  Backpack,
  Briefcase,
  Church,
  Crown,
  Droplet,
  Dumbbell,
  Flag,
  Footprints,
  Gem,
  Heart,
  Home,
  Layers,
  Mountain,
  Package,
  Palmtree,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Sun,
  Tag,
  Trophy,
  Users,
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

const ESSENTIAL_CLOSET: Pair[] = [
  ["Everyday", Shirt],
  ["Formal Wear", Crown],
  ["Office Wear", Briefcase],
  ["Matching Sets", Layers],
];

const OCCASION_WARDROBE: Pair[] = [
  ["Vacations", Palmtree],
  ["Weddings", Heart],
  ["Traditional", Backpack],
  ["Summer/Winter Outfitting", Sun],
];

const LIFESTYLE_EDIT: Pair[] = [
  ["Exercise Time", Dumbbell],
  ["Sports Day", Trophy],
  ["Maternity Cloths", Baby],
  ["Religionals", Church],
];

const FAMILY_VAULT: Pair[] = [
  ["Kids", Users],
  ["Boys", Users],
  ["Girls", Users],
  ["Ornaments", Gem],
];

const RENT_A_DRESS_MENU: MegaMenuData = {
  columns: [
    { heading: "The Essential Closet", items: ESSENTIAL_CLOSET.map(item) },
    { heading: "The Occasion Wardrobe", items: OCCASION_WARDROBE.map(item) },
    { heading: "The Lifestyle Edit", items: LIFESTYLE_EDIT.map(item) },
    { heading: "The Family Vault", items: FAMILY_VAULT.map(item) },
  ],
  promo: {
    image: "https://picsum.photos/seed/rent-a-dress/520/360",
    label: "RENT THE LOOK",
    href: "/categories?c=rent-a-dress",
  },
};

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
    href: "/categories?h=new-season",
  },
};

export const defaultMegaMenu: MegaMenuData = SHARED_MENU;

/** Per-label menus; anything not listed falls back to the shared subcategory menu. */
const MENU_BY_LABEL: Record<string, MegaMenuData> = {
  "rent-a-dress": RENT_A_DRESS_MENU,
};

export function getMegaMenu(label: string): MegaMenuData {
  return MENU_BY_LABEL[slug(label)] ?? SHARED_MENU;
}
