// Temporary mock data for dropdowns — replace with API calls later

export const mockSeasons = [
  { label: "Winter", value: "winter" },
  { label: "Summer", value: "summer" },
  { label: "786 NOOS/Summer", value: "786-summer" },
  { label: "786 NOOS/Winter", value: "786-winter" },
  { label: "2027 Main Collection", value: "2027-main" },
  { label: "2028 Main Collection", value: "2028-main" },
];

export const mockParentCategories = [
  { label: "Male (Men)", value: "pcat-male" },
  { label: "Female (Women)", value: "pcat-female" },
  { label: "Kids", value: "pcat-kids" },
  { label: "Home", value: "pcat-home" },
  { label: "Specials", value: "pcat-specials" },
  { label: "Gifts", value: "pcat-gifts" },
];

export const mockCategoriesByParent: Record<
  string,
  { label: string; value: string }[]
> = {
  "pcat-male": [
    { label: "Clothes", value: "cat-clothes" },
    { label: "Footwear", value: "cat-footwear" },
    { label: "Accessories", value: "cat-accessories" },
  ],
  "pcat-female": [
    { label: "Clothes", value: "cat-clothes" },
    { label: "Footwear", value: "cat-footwear" },
    { label: "Jewelry", value: "cat-jewelry" },
  ],
  "pcat-kids": [
    { label: "Clothes", value: "cat-clothes" },
    { label: "Footwear", value: "cat-footwear" },
    { label: "School Items", value: "cat-school" },
  ],
  "pcat-home": [
    { label: "Curtains", value: "cat-curtains" },
    { label: "Home Cloths", value: "cat-home-cloths" },
  ],
  "pcat-specials": [
    { label: "Fine Jewelry", value: "cat-fine-jewelry" },
    { label: "Fragrances", value: "cat-fragrances" },
  ],
  "pcat-gifts": [
    { label: "Gift Cards", value: "cat-gift-cards" },
    { label: "Accessories", value: "cat-accessories" },
  ],
};

export const mockSegmentsByCategory: Record<
  string,
  { label: string; value: string }[]
> = {
  "cat-clothes": [
    { label: "Tops", value: "seg-tops" },
    { label: "Bottoms", value: "seg-bottoms" },
    { label: "Outerwear", value: "seg-outerwear" },
    { label: "Knitwear", value: "seg-knitwear" },
    { label: "Underwear & Sleepwear", value: "seg-innerwear" },
  ],
  "cat-footwear": [
    { label: "Casual Shoes", value: "seg-shoes" },
    { label: "Boots", value: "seg-boots" },
    { label: "Sandals", value: "seg-sandals" },
  ],
  "cat-accessories": [
    { label: "Hats & Caps", value: "seg-hats" },
    { label: "Bags", value: "seg-bags" },
    { label: "Belts", value: "seg-belts" },
  ],
};

export const mockSubCategoriesBySegment: Record<
  string,
  { label: string; value: string }[]
> = {
  "seg-tops": [
    { label: "T-Shirt", value: "sub-tshirt" },
    { label: "Shirts", value: "sub-shirt" },
    { label: "Polo Shirts", value: "sub-polo" },
    { label: "Blouses", value: "sub-blouses" },
    { label: "Sweatshirts", value: "sub-sweatshirts" },
  ],
  "seg-bottoms": [
    { label: "Pants", value: "sub-pants" },
    { label: "Jeans Pants", value: "sub-jeans" },
    { label: "Shorts", value: "sub-shorts" },
    { label: "Skirts", value: "sub-skirts" },
  ],
  "seg-outerwear": [
    { label: "Indoor Jackets", value: "sub-indoor-jackets" },
    { label: "Outdoor Jackets", value: "sub-outdoor-jackets" },
    { label: "Outdoor Coat", value: "sub-coat" },
    { label: "Indoor Blazer", value: "sub-blazer" },
  ],
  "seg-knitwear": [
    { label: "Knitted Sweater", value: "sub-knitted-sweater" },
    { label: "Knitted Vest", value: "sub-knitted-vest" },
    { label: "Knitted Cardigan", value: "sub-cardigan" },
  ],
};

// Default fallback categories
export const mockCategories = [
  { label: "Clothes", value: "cat-clothes" },
  { label: "Footwear", value: "cat-footwear" },
  { label: "Accessories", value: "cat-accessories" },
];

export const mockSubCategories = mockSubCategoriesBySegment;

export const mockBrands = [
  { label: "Apple", value: "brand-1" },
  { label: "Samsung", value: "brand-2" },
  { label: "Nike", value: "brand-3" },
  { label: "Sony", value: "brand-4" },
  { label: "Adidas", value: "brand-5" },
];

export const mockProductAttributes = [
  { label: "Color", value: "attr-1" },
  { label: "Size", value: "attr-2" },
  { label: "Storage", value: "attr-3" },
  { label: "Material", value: "attr-4" },
];

export const mockAttributeValues: Record<
  string,
  { label: string; value: string }[]
> = {
  "attr-1": [
    { label: "Red", value: "val-1" },
    { label: "Blue", value: "val-2" },
    { label: "Black", value: "val-3" },
    { label: "White", value: "val-4" },
    { label: "Green", value: "val-5" },
  ],
  "attr-2": [
    { label: "S", value: "val-6" },
    { label: "M", value: "val-7" },
    { label: "L", value: "val-8" },
    { label: "XL", value: "val-9" },
    { label: "XXL", value: "val-10" },
  ],
  "attr-3": [
    { label: "64 GB", value: "val-11" },
    { label: "128 GB", value: "val-12" },
    { label: "256 GB", value: "val-13" },
    { label: "512 GB", value: "val-14" },
    { label: "1 TB", value: "val-15" },
  ],
  "attr-4": [
    { label: "Cotton", value: "val-16" },
    { label: "Polyester", value: "val-17" },
    { label: "Leather", value: "val-18" },
    { label: "Silk", value: "val-19" },
  ],
};
