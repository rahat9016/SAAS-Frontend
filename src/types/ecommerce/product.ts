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

export interface IReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
}

export interface IQuestion {
  id: string;
  author: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  answerDate?: string;
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
  isNewArrival?: boolean;
  tags?: string[];
  freeShipping?: boolean;
  specifications?: Record<string, string>;
  reviews?: IReview[];
  questions?: IQuestion[];
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
