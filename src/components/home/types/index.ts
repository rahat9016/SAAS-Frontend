export interface IHeroActionItem {
  id: number;
  title: string;
  subTitle: string;
  icon: string;
  link: string;
}

export interface HeroBannerProps {
  title: string;
  ctaLabel: string;
  href?: string;
  /** full-width background color class, e.g. "bg-sky-300" (fallback when no image) */
  bg: string;
  /** optional full-cover background image */
  image?: string;
  /** text color class */
  text?: string;
  /** band height */
  height?: string;
}
