import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import filterReducer from "./features/filter/filterSlice";
import genderReducer from "./features/gender/genderSlice";
import organizerReducer from "./features/organizer/organizationSlice";
import permissionReducer from "./features/permission/permissionSlice";
import rbacReducer from "./features/rbac/rbacSlice";
import userReducer from "./features/user/userSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";
import trialRoomReducer from "./features/trialRoom/trialRoomSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      auth: authReducer,
      organizer: organizerReducer,
      permission: permissionReducer,
      filter: filterReducer,
      gender: genderReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      trialRoom: trialRoomReducer,
      rbac: rbacReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
