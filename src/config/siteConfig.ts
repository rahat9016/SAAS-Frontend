export const siteConfig = {
  name:
    process.env.NEXT_PUBLIC_SITE_NAME ||
    "Tecgen Soft",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Tecgen Soft",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "West Khabaspur, Faridpur Sadar, Faridpur District, Dhaka Division, Bangladesh",
  phone1: process.env.NEXT_PUBLIC_PHONE_1 || "+88 02 9849422",
  phone2: process.env.NEXT_PUBLIC_PHONE_2 || "+88 02 9863360",
  email: process.env.NEXT_PUBLIC_EMAIL || "[EMAIL_ADDRESS]",
  currency: process.env.NEXT_PUBLIC_CURRENCY || "BDT",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "৳",
};
