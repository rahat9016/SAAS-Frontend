// ─── DB Entity Types ────────────────────────────────────────────────
export interface IProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  base_price: number;
  discounted_price?: number;
  discount_type?: "percentage" | "fixed";
  has_variants: boolean;
  stock: number;
  store_id: string;
  category_id: string;
  sub_category_id?: string;
  brand_id?: string;
  status: boolean;
}

export interface IProductAttribute {
  id: string;
  name: string; // e.g. "Color", "Size", "Storage"
  user_id: string;
  store_id: string;
}

export interface IProductAttributeValue {
  id: string;
  name: string; // e.g. "Red", "256 GB"
  attributes_id: string; // FK → IProductAttribute.id
  user_id: string;
}

export interface IProductVariant {
  id: string;
  product_id: string;
  images: string[];
  selling_price: number;
  discounted_price?: number;
  discount_type?: "percentage" | "fixed";
  stock_qty: number;
  user_id: string;
}

export interface IVariantAttributeMap {
  id: string;
  variant_id: string;
  attribute_value_id: string;
}

// ─── Form-level types ───────────────────────────────────────────────
export interface VariantAttributeFormRow {
  attributeId: string;
  attributeValueId: string;
}

export interface VariantFormBlock {
  images: (File | string)[];
  sellingPrice: number | "";
  discountedPrice: number | "";
  discountType: "percentage" | "fixed";
  stockQty: number | "";
  attributes: VariantAttributeFormRow[];
}

export interface ProductFormValues {
  name: string;
  description: string;
  images: (File | string)[];
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  hasVariants: boolean;
  basePrice: number | "";
  discountedPrice: number | "";
  discountType: "percentage" | "fixed";
  stock: number | "";
  status: boolean;
  variants: VariantFormBlock[];
}

// ─── Table / List types ─────────────────────────────────────────────
export interface IProductListItem {
  id: string;
  name: string;
  image?: string;
  category: string;
  price: number;
  stock: number;
  status: boolean;
  hasVariants: boolean;
  actions?: string;
}

export interface IProductDetail {
  id: string;
  name: string;
  description: string;
  images: string[];
  basePrice: number;
  discountedPrice?: number;
  discountType?: "percentage" | "fixed";
  hasVariants: boolean;
  stock: number;
  category: string;
  subCategory?: string;
  brand?: string;
  status: boolean;
  variants?: IProductVariantDetail[];
  createdAt: string;
}

export interface IProductVariantDetail {
  id: string;
  images: string[];
  sellingPrice: number;
  discountedPrice?: number;
  discountType?: "percentage" | "fixed";
  stockQty: number;
  attributes: {
    name: string;
    value: string;
  }[];
}
