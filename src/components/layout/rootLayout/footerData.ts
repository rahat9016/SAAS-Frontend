export interface FooterLink {
  label: string;
  href: string;
}

const catSlug = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/\//g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const productCategories: FooterLink[] = [
  "Blouses", "Shirts", "T-shirts", "Polo shirts", "Sweatshirts", "Sweatshirt Jacke", "Indoor jackets",
  "Indoor Blazer", "Indoor-Sakko", "Indoor-Weste", "Outdoor jackets", "Outdoor-Coat", "Outdoor-Weste",
  "Outdoor-Poncho", "Outdoor-Umhang", "Knitwear", "Knitted sweater", "Knitted Vest", "Knitted cardigan",
  "Knitted twinset", "Pants", "Jeans pants", "Skirts", "One-pieces/dresses", "Underwear", "Swimwear",
  "Accessories", "Socks/Hosiery", "Daywear", "Hats", "Curtains", "Home Cloths", "Shoes", "Fine Jewelry",
  "Fashion Jewelry", "Bags", "Fragrances", "Flags", "Religious", "Traditionals",
].map((c) => ({ label: c, href: `/categories?c=${catSlug(c)}` }));

export const moreInspiration: FooterLink[] = [
  "Backpacks", "Bomber Jackets", "Dirndl Dresses", "Dresses", "Football Boots", "Handbags", "Jeans",
  "Kids' Clothing", "Kids' Shoes", "Men's Chinos", "Men's Clothing", "Men's Coats", "Men's Shoes", "Necklaces",
  "Purses", "Shirt Dresses", "Snow Boots", "Thigh High Boots", "Trainers", "Ugg", "Wellies",
  "Women's Ankle Boots", "Women's Boots", "Women's Clothing", "Women's Coats", "Women's Shirts", "Women's Shoes",
].map((b) => ({ label: b, href: "/categories" }));

export const helpLinks: FooterLink[] = [
  { label: "See all help topics", href: "/help" },
  { label: "Paying by invoice", href: "/help/invoice" },
  { label: "Report a damaged item", href: "/help/damaged" },
  { label: "Return an order", href: "/orders" },
  { label: "Report a vulnerability", href: "/help/security" },
  { label: "Product Safety", href: "/help/safety" },
  { label: "Track your parcel", href: "/orders" },
  { label: "Delivery information", href: "/help/delivery" },
  { label: "Find the right size", href: "/help/size" },
  { label: "Subscribe to our newsletter", href: "/newsletter" },
  { label: "Withdrawal", href: "/help/withdrawal" },
];

export const giftCardLinks: FooterLink[] = [
  { label: "Buy Gift Cards", href: "/gift-cards" },
  { label: "About gift cards and vouchers", href: "/gift-cards/about" },
  { label: "Redeem a Gift Card", href: "/gift-cards/redeem" },
];

export const aboutLinks: FooterLink[] = [
  { label: "Visit our corporate site", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Newsroom", href: "#" },
  { label: "Investor Relations", href: "#" },
  { label: "Partner", href: "#" },
];

export const legalLinks: FooterLink[] = [
  { label: "Imprint", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Notice", href: "#" },
  { label: "Data preferences", href: "#" },
  { label: "Accessibility statement", href: "#" },
  { label: "Community Guidelines", href: "#" },
];

export const partners = ["DHL", "DHL Express", "Hermes"];
export const paymentMethods = [
  "Mastercard", "VISA", "PayPal", "Invoice", "SEPA", "Klarna", "AMEX", "Discover", "Diners", "Apple Pay",
];
export const promises = [
  "Free delivery for orders over $34.90",
  "14-day return policy",
  "Flexible payment options",
];
