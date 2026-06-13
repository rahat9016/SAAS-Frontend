import type { Gender } from "./GenderContext";

export interface NavLink {
  label: string;
  href: string;
  isHighlighted?: boolean;
}

const cat = (label: string): NavLink => ({
  label,
  href: `/categories?c=${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
});

// Category bar (matches the reference design).
const CATEGORIES: NavLink[] = [
  { label: "NEW IN", href: "/products?filter=new" },
  cat("Custom-Teamwear"),
  cat("Rent-a-Dress"),
  cat("Golden-Draw"),
  cat("Clothing"),
  cat("Basics"),
  cat("Sportswear"),
  cat("Streetwear"),
  cat("Workwear"),
  cat("Accessories"),
  cat("Baggage"),
  cat("Shoes"),
  { label: "Sale %", href: "/products?filter=sale", isHighlighted: true },
  { label: "Pre-owned & Sell", href: "/products?filter=pre-owned" },
];

/** Same category set shown under every parent (Women / Men / Kids). */
export const navByGender: Record<Gender, NavLink[]> = {
  Women: CATEGORIES,
  Men: CATEGORIES,
  Kids: CATEGORIES,
};

/** Backwards-compatible flat list. */
export const navLinks = CATEGORIES;
