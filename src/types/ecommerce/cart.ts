export interface ICartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  stock: number;
  variantName?: string;
  selectedAttributes?: Record<string, string>;
  freeShipping?: boolean;
}

export interface ICart {
  items: ICartItem[];
  couponCode?: string;
  couponDiscount?: number;
}

export interface ICartSummary {
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
}
