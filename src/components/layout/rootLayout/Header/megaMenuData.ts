import {
  Backpack,
  Baby,
  Camera,
  CreditCard,
  Crown,
  Droplet,
  Dumbbell,
  Footprints,
  Gift,
  Glasses,
  Heart,
  Mountain,
  Package,
  Recycle,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Tag,
  Watch,
  Zap,
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
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Pair = [string, LucideIcon];

const item = (label: string, icon: LucideIcon, highlight = false): MegaItem => ({
  label,
  href: `/categories?c=${slug(label)}`,
  icon,
  highlight,
});

// Shared "Highlights" column reused across categories.
const HIGHLIGHTS: MegaColumn = {
  heading: "Highlights",
  items: [
    item("Family vacation", Camera),
    item("Urban Utility", Zap),
    { ...item("Sneaker Releases", Footprints), highlight: true },
    item("Gift Cards", CreditCard),
    item("Sell Kids Items", Package),
    item("Gift Shop", Gift),
  ],
};

function menu(
  categories: Pair[],
  more: Pair[],
  promoLabel: string,
  promoSeed: string,
): MegaMenuData {
  return {
    columns: [
      { heading: "Categories", items: categories.map(([l, i]) => item(l, i)) },
      { heading: "More categories", items: more.map(([l, i]) => item(l, i)) },
      HIGHLIGHTS,
    ],
    promo: {
      image: `https://picsum.photos/seed/${promoSeed}/520/360`,
      label: promoLabel,
      href: `/products?h=${slug(promoLabel)}`,
    },
  };
}

// Per-category mega menus (keyed by the nav label).
export const megaMenus: Record<string, MegaMenuData> = {
  "NEW IN": menu(
    [["New dresses", Shirt], ["New shoes", Footprints], ["New bags", Backpack], ["New denim", Tag], ["New sportswear", Dumbbell], ["New arrivals", Sparkles]],
    [["Caps", Glasses], ["Backpacks & bags", Backpack], ["Outdoor styles", Mountain], ["Hiking shoes", Footprints], ["Onepieces & sets", Baby], ["Jackets", Shirt]],
    "JUST DROPPED", "newin",
  ),
  Clothing: menu(
    [["Dresses", Shirt], ["Trousers", Tag], ["Skirts", Tag], ["Shirts & tops", Shirt], ["Jackets", Shirt], ["Knitwear", Snowflake]],
    [["Caps", Glasses], ["Backpacks & bags", Backpack], ["Outdoor styles", Mountain], ["Hiking shoes", Footprints], ["Onepieces & sets", Baby], ["Transseasonal jackets", Shirt]],
    "SUMMER EDIT", "clothing",
  ),
  Basics: menu(
    [["T-shirts", Shirt], ["Tank tops", Shirt], ["Leggings", Tag], ["Socks", Footprints], ["Underwear", Package], ["Loungewear", Shirt]],
    [["Multipacks", Package], ["Sports basics", Dumbbell], ["Seamless", Sparkles], ["Thermal", Snowflake], ["Shapewear", Heart], ["Sets", Gift]],
    "EVERYDAY BASICS", "basics",
  ),
  Shoes: menu(
    [["Sneakers", Footprints], ["Boots", Footprints], ["Sandals", Footprints], ["Heels", Crown], ["Flats", Footprints], ["Loafers", Footprints]],
    [["Hiking shoes", Mountain], ["Running shoes", Dumbbell], ["Slides", Footprints], ["Espadrilles", Footprints], ["Shoe care", Droplet], ["Laces & insoles", Tag]],
    "SNEAKER RELEASES", "shoes",
  ),
  Streetwear: menu(
    [["Hoodies", Shirt], ["Oversized tees", Shirt], ["Cargo pants", Tag], ["Caps", Glasses], ["Sneakers", Footprints], ["Crossbody bags", Backpack]],
    [["Graphic tees", Shirt], ["Track pants", Tag], ["Beanies", Crown], ["Skate shoes", Footprints], ["Bucket hats", Glasses], ["Logo styles", Sparkles]],
    "STREET ICONS", "streetwear",
  ),
  Sports: menu(
    [["Running", Dumbbell], ["Training", Dumbbell], ["Football", Footprints], ["Yoga", Heart], ["Outdoor", Mountain], ["Swim", Droplet]],
    [["Sports shoes", Footprints], ["Sports bras", Heart], ["Leggings", Tag], ["Jackets", Shirt], ["Accessories", Watch], ["Equipment", Package]],
    "GAME ON", "sports",
  ),
  Accessories: menu(
    [["Bags", ShoppingBag], ["Caps", Glasses], ["Sunglasses", Glasses], ["Belts", Tag], ["Jewellery", Sparkles], ["Watches", Watch]],
    [["Backpacks", Backpack], ["Wallets", CreditCard], ["Scarves", Snowflake], ["Hats", Crown], ["Hair accessories", Sparkles], ["Tech accessories", Zap]],
    "FINISH THE LOOK", "accessories",
  ),
  Designer: menu(
    [["Designer bags", ShoppingBag], ["Designer shoes", Footprints], ["Designer dresses", Crown], ["Designer denim", Tag], ["New in designer", Sparkles], ["Designer sale", Tag]],
    [["Luxury watches", Watch], ["Sunglasses", Glasses], ["Small leather goods", CreditCard], ["Designer kids", Baby], ["Iconic styles", Crown], ["Pre-owned luxury", Recycle]],
    "DESIGNER EDIT", "designer",
  ),
  Care: menu(
    [["Skincare", Droplet], ["Haircare", Sparkles], ["Fragrance", Sparkles], ["Makeup", Heart], ["Tools", Package], ["Gift sets", Gift]],
    [["Bath & body", Droplet], ["Men's grooming", Zap], ["Sun care", Camera], ["Natural beauty", Heart], ["Travel sizes", Package], ["New in beauty", Sparkles]],
    "GLOW UP", "care",
  ),
  "Sale %": menu(
    [["Sale dresses", Shirt], ["Sale shoes", Footprints], ["Sale bags", ShoppingBag], ["Sale denim", Tag], ["Sale sportswear", Dumbbell], ["Clearance", Tag]],
    [["Up to 30%", Tag], ["Up to 50%", Tag], ["Up to 70%", Tag], ["Last sizes", Package], ["Sale designer", Crown], ["Sale kids", Baby]],
    "SUMMER SALE", "sale",
  ),
  "Pre-owned": menu(
    [["Pre-owned bags", ShoppingBag], ["Pre-owned shoes", Footprints], ["Pre-owned clothing", Shirt], ["Pre-owned designer", Crown], ["Sell items", Recycle], ["How it works", Tag]],
    [["Vintage", Recycle], ["Like new", Sparkles], ["Refurbished", Package], ["Trending pre-owned", Zap], ["Designer pre-owned", Crown], ["Sustainability", Recycle]],
    "SHOP CIRCULAR", "preowned",
  ),
};

export const defaultMegaMenu: MegaMenuData = megaMenus.Clothing;

/** Get the menu for a nav label, falling back to the default. */
export function getMegaMenu(label: string): MegaMenuData {
  return megaMenus[label] ?? defaultMegaMenu;
}
