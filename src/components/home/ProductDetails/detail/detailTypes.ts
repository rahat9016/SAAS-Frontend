// Presentational types for the product details page (props-driven, no
// fetching/redux) so each piece is reusable + independent.

export interface DetailColor {
  id: string;
  label: string;
  image: string;
  href?: string;
}

export interface DetailSize {
  label: string;
  note?: string; // e.g. "Only 1 left"
  soldOut?: boolean;
}

export interface DetailSpec {
  label: string;
  value: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  brand: string;
  brandHref?: string;
  title: string;
  price: number;
  lastLowest?: number;
  discountLabel?: string; // "-22%"
  colourName: string;
  images: string[];
  colors: DetailColor[];
  sizes: DetailSize[];
  inStock: boolean;
  soldBy: string;
  delivery: { range: string; cost: string };
  material: DetailSpec[];
  details: DetailSpec[];
  sizeFit: DetailSpec[];
  articleNumber?: string;
}
