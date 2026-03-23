export const siteConfig = {
  name:
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "X-Plaza",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "X-Plaza",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "House 12, Road 12, Sector 11, Uttara, Dhaka-1230, Bangladesh",
  phone1: process.env.NEXT_PUBLIC_PHONE_1 || "+88 01711-358400",
  phone2: process.env.NEXT_PUBLIC_PHONE_2 || "+88 01711-358400",
  email: process.env.NEXT_PUBLIC_EMAIL || "[EMAIL_ADDRESS]",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "BDT",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳",
};
