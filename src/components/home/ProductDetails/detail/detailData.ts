import { ProductDetail } from "./detailTypes";

const u = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const SNEAKER_IDS = [
  "1542291026-7eec264c27ff",
  "1600185365926-3a2ce3cdb9eb",
  "1556906781-9a412961c28c",
  "1465453869711-7e174808ace9",
  "1595950653106-6c9ebd614d3a",
];

const APPAREL_IDS = [
  "1539109136881-3be0616acf4b",
  "1490481651871-ab68de25d43d",
  "1483985988355-763728e1935b",
  "1485462537746-965f33f7f6a7",
];

/** Default mock product detail (sneaker, in stock, multiple colours, sizes). */
export const sampleDetail: ProductDetail = {
  id: "adidas-spezial",
  slug: "adidas-originals-spezial",
  brand: "adidas Originals",
  brandHref: "/brands",
  title: "ADIDAS ORIGINALS SPEZIAL SHOES - Trainers - clear sky night indigo crystal sky",
  price: 109.95,
  colourName: "clear sky night indigo crystal sky",
  images: SNEAKER_IDS.map((id) => u(id)),
  colors: [
    {
      id: "c1",
      label: "Clear sky",
      image: u(SNEAKER_IDS[0], 200, 240),
      images: [SNEAKER_IDS[0], SNEAKER_IDS[3], SNEAKER_IDS[4]].map((id) => u(id)),
    },
    {
      id: "c2",
      label: "Indigo",
      image: u(SNEAKER_IDS[1], 200, 240),
      images: [SNEAKER_IDS[1], SNEAKER_IDS[2], SNEAKER_IDS[0]].map((id) => u(id)),
    },
    {
      id: "c3",
      label: "Grey",
      image: u(SNEAKER_IDS[2], 200, 240),
      images: [SNEAKER_IDS[2], SNEAKER_IDS[4], SNEAKER_IDS[1]].map((id) => u(id)),
    },
  ],
  sizes: [
    { label: "UK 6" },
    { label: "UK 6.5", note: "Only 1 left" },
    { label: "UK 7" },
    { label: "UK 8" },
    { label: "UK 9" },
    { label: "UK 10", soldOut: true },
  ],
  inStock: true,
  soldBy: "adidas",
  delivery: { range: "Wed 10 Jun – Fri 12 Jun", cost: "free" },
  material: [
    { label: "Upper material", value: "Textile" },
    { label: "Lining", value: "Synthetics" },
    { label: "Insole", value: "Textile" },
    { label: "Sole", value: "Natural rubber" },
    { label: "Padding type", value: "Cold padding" },
  ],
  details: [
    { label: "Shoe tip", value: "Round" },
    { label: "Heel type", value: "Flat" },
    { label: "Fastening", value: "Laces" },
    { label: "Pattern", value: "Plain" },
    { label: "Qualities", value: "Breathable" },
  ],
  sizeFit: [{ label: "Shoe width", value: "Regular" }],
  articleNumber: "AD112P090-K11",
};

/** A second variant: out-of-stock sports shorts (multiple colours). */
export const shortsDetail: ProductDetail = {
  id: "uhlsport-shorts",
  slug: "uhlsport-sports-shorts",
  brand: "uhlsport",
  brandHref: "/brands",
  title: "Sports shorts - azurblau",
  price: 13.22,
  lastLowest: 16.95,
  discountLabel: "-22%",
  colourName: "azurblau",
  images: APPAREL_IDS.map((id) => u(id)),
  colors: [
    { id: "s1", label: "Azurblau", image: u(APPAREL_IDS[0], 200, 240), images: [APPAREL_IDS[0], APPAREL_IDS[1]].map((id) => u(id)) },
    { id: "s2", label: "Blue", image: u(APPAREL_IDS[1], 200, 240), images: [APPAREL_IDS[1], APPAREL_IDS[2]].map((id) => u(id)) },
    { id: "s3", label: "Grey", image: u(APPAREL_IDS[2], 200, 240), images: [APPAREL_IDS[2], APPAREL_IDS[3]].map((id) => u(id)) },
    { id: "s4", label: "Lime", image: u(APPAREL_IDS[3], 200, 240), images: [APPAREL_IDS[3], APPAREL_IDS[0]].map((id) => u(id)) },
  ],
  sizes: [
    { label: "XS" },
    { label: "S", note: "Only 1 left" },
    { label: "M" },
    { label: "L" },
    { label: "XL" },
    { label: "XXL" },
  ],
  inStock: false,
  soldBy: "uhlsport",
  delivery: { range: "Fri 12 Jun – Mon 15 Jun", cost: "free" },
  material: [
    { label: "Outer fabric material", value: "100% polyester" },
    { label: "Padding type", value: "No lining" },
    { label: "Fabric", value: "Knit" },
    { label: "Care instructions", value: "Machine wash at 30 °C" },
  ],
  details: [
    { label: "Pattern", value: "Plain" },
    { label: "Fastening", value: "Elastic waistband" },
  ],
  sizeFit: [{ label: "Fit", value: "Regular" }],
  articleNumber: "UH998X011-K11",
};

/** Resolve a product detail by slug (falls back to the sample). */
export function getProductDetail(slug: string): ProductDetail {
  if (slug === shortsDetail.slug) return shortsDetail;
  return { ...sampleDetail, slug };
}
