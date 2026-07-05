// Shared, presentational types for the home page sections.
// Every home component is independent + props-driven (no redux/data fetching),
// so each can be reused or rendered in isolation.

export interface HomeProduct {
  id: string;
  image: string;
  brand: string;
  name: string;
  /** current "From" price */
  price: number;
  /** crossed-out original RRP */
  originalPrice?: number;
  /** last lowest price before this deal */
  lastLowest?: number;
  /** e.g. "-8%" shown next to last-lowest */
  lastLowestLabel?: string;
  /** black pill over the image, e.g. "15% EXTRA" */
  extraLabel?: string;
  /** red "Deal" pill over the image */
  deal?: boolean;
  href?: string;
  /** product slug — enables the virtual trial-room shortcut when present */
  slug?: string;
}

export interface BannerContent {
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** text color theme over the image */
  theme?: "light" | "dark";
}

export interface BrandStory {
  id: string;
  image: string;
  logo?: string;
  title: string;
  subtitle?: string;
  href?: string;
}

export interface BoardItem {
  id: string;
  image: string;
  title: string;
  href?: string;
}
