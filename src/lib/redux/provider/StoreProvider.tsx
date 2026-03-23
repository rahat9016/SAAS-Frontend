"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../store";
import { initCart } from "../features/cart/cartSlice";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => makeStore(), []);

  useEffect(() => {
    store.dispatch(initCart());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
