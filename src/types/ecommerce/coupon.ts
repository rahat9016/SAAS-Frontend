export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface ICoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface IShippingZone {
  id: string;
  name: string;
  areas: string[];
  rate: number;
  estimatedDays: string;
}
