import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenderState {
  /** User-selected gender; "" means "follow the first available". */
  selected: string;
}

const initialState: GenderState = {
  selected: "",
};

const genderSlice = createSlice({
  name: "gender",
  initialState,
  reducers: {
    setGender: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
  },
});

export const { setGender } = genderSlice.actions;
export default genderSlice.reducer;
