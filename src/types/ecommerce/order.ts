export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  COD = "COD",
  SSLCOMMERZ = "SSLCOMMERZ",
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  STRIPE = "STRIPE",
}

export interface IShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  division: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface IOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPayment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  paidAt?: string;
}
