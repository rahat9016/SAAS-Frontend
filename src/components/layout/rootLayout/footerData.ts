export interface FooterLink {
  label: string;
  href: string;
}

export const moreBrands: FooterLink[] = [
  "adidas", "Adidas Terrex", "ASICS", "Banana Republic", "Calvin Klein Underwear", "Clarks", "Coach", "Converse",
  "Diesel", "Dr Martens", "Fossil", "French Connection", "G-Star", "GAP", "Helly Hansen", "Lacoste",
  "Levi's ®", "Michael Kors", "New Balance", "Nike", "Puma", "Ralph Lauren", "Ray Ban", "Skechers",
  "Ted Baker", "The North Face", "Timberland", "Tommy Hilfiger", "Vans",
].map((b) => ({ label: b, href: "/brands" }));

export const moreInspiration: FooterLink[] = [
  "Backpacks", "Bomber Jackets", "Dirndl Dresses", "Dresses", "Football Boots", "Handbags", "Jeans",
  "Kids' Clothing", "Kids' Shoes", "Men's Chinos", "Men's Clothing", "Men's Coats", "Men's Shoes", "Necklaces",
  "Purses", "Shirt Dresses", "Snow Boots", "Thigh High Boots", "Trainers", "Ugg", "Wellies",
  "Women's Ankle Boots", "Women's Boots", "Women's Clothing", "Women's Coats", "Women's Shirts", "Women's Shoes",
].map((b) => ({ label: b, href: "/products" }));

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
  "30-day return policy",
  "Flexible payment options",
];
