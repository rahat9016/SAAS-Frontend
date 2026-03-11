import { BookingType } from "@/src/types/common/common";
import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./filterTypes";

const initialState: IInitialState = {
  sortBy: "",
  selectDepartment: "",
  bookingType: BookingType.ONSITE,
  selectDoctor: "",
};

const filteringSlice = createSlice({
  name: "filtering",
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.sortBy = "";
      state.selectDepartment = "";
      state.bookingType = "";
      state.selectDoctor = "";
    },
    setSelectDepartments: (state, action) => {
      state.selectDepartment = action.payload;
    },
    setBookingType: (state, action) => {
      state.bookingType = action.payload;
    },
    setSelectDoctor: (state, action) => {
      state.selectDoctor = action.payload;
    },
  },
});

export const {
  setSortBy,
  clearFilters,
  setSelectDepartments,
  setBookingType,
  setSelectDoctor,
} = filteringSlice.actions;
export default filteringSlice.reducer;
