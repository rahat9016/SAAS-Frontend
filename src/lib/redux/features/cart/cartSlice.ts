"use client";

import { ICartItem } from "@/src/types/ecommerce/cart";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getCartData, saveCartData } from "@/src/lib/indexedDB";

interface CartState {
  items: ICartItem[];
  couponCode: string | null;
  couponDiscount: number;
  initialized: boolean;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  couponDiscount: 0,
  initialized: false,
};

// Load cart from IndexedDB
export const initCart = createAsyncThunk("cart/init", async () => {
  const data = await getCartData<CartState>("cartState");
  return data ?? null;
});

const persistCart = (state: CartState) => {
  if (typeof window !== "undefined") {
    saveCartData("cartState", {
      items: state.items,
      couponCode: state.couponCode,
      couponDiscount: state.couponDiscount,
    });
  }
};

// Helper to build a unique key for matching cart items by attributes
const itemKey = (item: { productId: string; selectedAttributes?: Record<string, string> }) => {
  const attrs = item.selectedAttributes
    ? Object.entries(item.selectedAttributes)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|")
    : "";
  return `${item.productId}__${attrs}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ICartItem>) {
      const newKey = itemKey(action.payload);
      const existing = state.items.find((item) => itemKey(item) === newKey);

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
      action: PayloadAction<{ productId: string; selectedAttributes?: Record<string, string> }>
    ) {
      const removeKey = itemKey(action.payload);
      state.items = state.items.filter((item) => itemKey(item) !== removeKey);
      persistCart(state);
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        selectedAttributes?: Record<string, string>;
        quantity: number;
      }>
    ) {
      const targetKey = itemKey(action.payload);
      const item = state.items.find((item) => itemKey(item) === targetKey);
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
  extraReducers: (builder) => {
    builder.addCase(initCart.fulfilled, (state, action) => {
      if (action.payload) {
        state.items = action.payload.items ?? [];
        state.couponCode = action.payload.couponCode ?? null;
        state.couponDiscount = action.payload.couponDiscount ?? 0;
      }
      state.initialized = true;
    });
    builder.addCase(initCart.rejected, (state) => {
      state.initialized = true;
    });
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
