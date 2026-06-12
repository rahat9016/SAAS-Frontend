"use client";

import { createContext, useContext, useState } from "react";

export type Gender = "Women" | "Men" | "Kids";
export const GENDERS: Gender[] = ["Women", "Men", "Kids"];

interface GenderCtx {
  gender: Gender;
  setGender: (g: Gender) => void;
}

const Ctx = createContext<GenderCtx>({ gender: "Women", setGender: () => {} });

export function GenderProvider({ children }: { children: React.ReactNode }) {
  const [gender, setGender] = useState<Gender>("Women");
  return <Ctx.Provider value={{ gender, setGender }}>{children}</Ctx.Provider>;
}

export const useGender = () => useContext(Ctx);
