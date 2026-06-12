import type { Gender } from "./GenderContext";

export interface NavLink {
  label: string;
  href: string;
  isHighlighted?: boolean;
}

const base = (g: string, label: string): NavLink => ({
  label,
  href: `/categories?g=${g.toLowerCase()}&c=${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
});

/** Category nav links per parent gender (Women / Men / Kids). */
export const navByGender: Record<Gender, NavLink[]> = {
  Women: [
    { label: "NEW IN", href: "/products?g=women&filter=new" },
    base("women", "Clothing"),
    base("women", "Dresses"),
    base("women", "Tops"),
    base("women", "Shoes"),
    base("women", "Bags"),
    base("women", "Jewellery"),
    base("women", "Lingerie"),
    base("women", "Sportswear"),
    base("women", "Beauty"),
    base("women", "Designer"),
    { label: "Sale %", href: "/products?g=women&filter=sale", isHighlighted: true },
  ],
  Men: [
    { label: "NEW IN", href: "/products?g=men&filter=new" },
    base("men", "Clothing"),
    base("men", "T-Shirts"),
    base("men", "Shoes"),
    base("men", "Sneakers"),
    base("men", "Sportswear"),
    base("men", "Streetwear"),
    base("men", "Watches"),
    base("men", "Grooming"),
    base("men", "Designer"),
    { label: "Sale %", href: "/products?g=men&filter=sale", isHighlighted: true },
  ],
  Kids: [
    { label: "NEW IN", href: "/products?g=kids&filter=new" },
    base("kids", "Girls"),
    base("kids", "Boys"),
    base("kids", "Baby"),
    base("kids", "Shoes"),
    base("kids", "Sportswear"),
    base("kids", "School"),
    base("kids", "Toys"),
    base("kids", "Accessories"),
    { label: "Sale %", href: "/products?g=kids&filter=sale", isHighlighted: true },
  ],
};

/** Backwards-compatible flat list (defaults to Women). */
export const navLinks = navByGender.Women;
