// Temporary mock data for dropdowns — replace with API calls later

export const mockCategories = [
  { label: "Electronics", value: "cat-1" },
  { label: "Clothing", value: "cat-2" },
  { label: "Home & Kitchen", value: "cat-3" },
  { label: "Beauty & Health", value: "cat-4" },
];

export const mockSubCategories: Record<
  string,
  { label: string; value: string }[]
> = {
  "cat-1": [
    { label: "Smartphones", value: "sub-1" },
    { label: "Laptops", value: "sub-2" },
    { label: "Accessories", value: "sub-3" },
  ],
  "cat-2": [
    { label: "Men's Wear", value: "sub-4" },
    { label: "Women's Wear", value: "sub-5" },
    { label: "Kids", value: "sub-6" },
  ],
  "cat-3": [
    { label: "Furniture", value: "sub-7" },
    { label: "Kitchenware", value: "sub-8" },
  ],
  "cat-4": [
    { label: "Skincare", value: "sub-9" },
    { label: "Hair Care", value: "sub-10" },
  ],
};

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
