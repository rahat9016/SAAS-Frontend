"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
}

const getInitialState = (): WishlistState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore corrupted data
      }
    }
  }
  return { productIds: [] };
};

const persistWishlist = (state: WishlistState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("wishlist", JSON.stringify(state));
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: getInitialState(),
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const index = state.productIds.indexOf(action.payload);
      if (index > -1) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(action.payload);
      }
      persistWishlist(state);
    },

    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter(
        (id) => id !== action.payload
      );
      persistWishlist(state);
    },

    clearWishlist(state) {
      state.productIds = [];
      persistWishlist(state);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
