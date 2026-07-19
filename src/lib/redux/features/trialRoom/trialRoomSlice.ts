"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrialRoomState {
  productIds: string[];
}

const getInitialState = (): TrialRoomState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("trialRoom");
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

const persistTrialRoom = (state: TrialRoomState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("trialRoom", JSON.stringify(state));
  }
};

const trialRoomSlice = createSlice({
  name: "trialRoom",
  initialState: getInitialState(),
  reducers: {
    toggleTrialRoom(state, action: PayloadAction<string>) {
      const index = state.productIds.indexOf(action.payload);
      if (index > -1) {
        state.productIds.splice(index, 1);
      } else {
        state.productIds.push(action.payload);
      }
      persistTrialRoom(state);
    },

    removeFromTrialRoom(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter(
        (id) => id !== action.payload
      );
      persistTrialRoom(state);
    },

    clearTrialRoom(state) {
      state.productIds = [];
      persistTrialRoom(state);
    },
  },
});

export const { toggleTrialRoom, removeFromTrialRoom, clearTrialRoom } =
  trialRoomSlice.actions;

export default trialRoomSlice.reducer;
