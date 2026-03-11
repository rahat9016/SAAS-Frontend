"use client";

import { ICartItem } from "@/src/types/ecommerce/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: ICartItem[];
  couponCode: string | null;
  couponDiscount: number;
}

const getInitialState = (): CartState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore corrupted data
      }
    }
  }
  return {
    items: [],
    couponCode: null,
    couponDiscount: 0,
  };
};

const persistCart = (state: CartState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const existing = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existing) {
        const newQty = existing.quantity + action.payload.quantity;
        existing.quantity = Math.min(newQty, existing.stock);
      } else {
        state.items.push(action.payload);
      }
      persistCart(state);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>
    ) {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.variantId === action.payload.variantId
          )
      );
      persistCart(state);
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        variantId?: string;
        quantity: number;
      }>
    ) {
      const item = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
      persistCart(state);
    },

    applyCoupon(
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
      persistCart(state);
    },

    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
      persistCart(state);
    },

    clearCart(state) {
      state.items = [];
      state.couponCode = null;
      state.couponDiscount = 0;
      persistCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
