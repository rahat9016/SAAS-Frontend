import { IProduct } from "./product";

export interface IWishlistItem {
  id: string;
  productId: string;
  product: IProduct;
  addedAt: string;
}
