export interface IProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface IProductAttribute {
  name: string;
  value: string;
}

export interface IProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: IProductAttribute[];
  image?: IProductImage;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: IProductImage[];
  category: ICategory;
  subcategory?: ICategory;
  brand?: IBrand;
  variants: IProductVariant[];
  attributes: IProductAttribute[];
  stock: number;
  sku: string;
  rating: number;
  totalReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: ICategory[];
  productCount?: number;
}

export interface IBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  productCount?: number;
}
