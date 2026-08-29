"use client";

import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { IColorway, IColorwayState } from "./colorwayTypes";

const STORAGE_KEY = "colorways";

const generateCode = () => `CLR-${nanoid(6).toUpperCase()}`;

const getDefaultItems = (): Record<string, IColorway> => {
  const seeds: Omit<IColorway, "code" | "createdAt">[] = [
    {
      name: "yellow",
      colorway: "1015",
      spec: "1015",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 11-0616 TCX Pastel Yellow",
      colorHex: "#f3e5ab",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: true,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "light blue",
      colorway: "5027",
      spec: "5027",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 14-4211 TCX Niagara Mist",
      colorHex: "#9dafb9",
      active: false,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "blue",
      colorway: "5525",
      spec: "5525",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-4035 TCX Dark Blue",
      colorHex: "#2b4f6b",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "navy",
      colorway: "5978",
      spec: "5978",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-4020 TCX Dark Sapphire",
      colorHex: "#1c2536",
      active: false,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "beige",
      colorway: "8148",
      spec: "8148",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 15-1305 TCX Feather Grey",
      colorHex: "#a79c93",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: false,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
    {
      name: "dark brown",
      colorway: "8941",
      spec: "8941",
      description: "",
      standard: "Pantone",
      pantone: "PANTONE® 19-1314 TCX Seal",
      colorHex: "#483c32",
      active: true,
      inTheme: true,
      sustLabelOff: false,
      planSms: true,
      plan3dSms: false,
      actualSms: false,
      startDate: "",
      endDate: "",
      clearanceDate: "",
    },
  ];

  return Object.fromEntries(
    seeds.map((seed) => {
      const item: IColorway = {
        ...seed,
        code: generateCode(),
        createdAt: new Date().toISOString(),
      };
      return [item.code, item];
    })
  );
};

const getInitialState = (): IColorwayState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { items: JSON.parse(saved) };
      } catch {
        // ignore corrupted data
      }
    }
  }
  return { items: getDefaultItems() };
};

const persistItems = (items: Record<string, IColorway>) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

const colorwaySlice = createSlice({
  name: "colorway",
  initialState: getInitialState(),
  reducers: {
    createColorway: {
      reducer: (state, action: PayloadAction<IColorway>) => {
        state.items[action.payload.code] = action.payload;
        persistItems(state.items);
      },
      prepare: (payload: Omit<IColorway, "code" | "createdAt">) => ({
        payload: {
          ...payload,
          code: generateCode(),
          createdAt: new Date().toISOString(),
        },
      }),
    },
  },
});

export const { createColorway } = colorwaySlice.actions;
export default colorwaySlice.reducer;
