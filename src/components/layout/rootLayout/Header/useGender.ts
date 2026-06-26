"use client";

import { setGender as setGenderAction } from "@/src/lib/redux/features/gender/genderSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import type { Gender } from "./navLinks";
import { useNavigation } from "./useNavigation";

/**
 * Header gender state. Selection lives in Redux; the gender list and category
 * links come from the API (`useNavigation`, cached). No context provider needed.
 */
export function useGender() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.gender.selected);
  const { genders, navByGender, isLoading } = useNavigation();

  // Effective gender: the user's pick if still valid, else the first available.
  const gender =
    selected && genders.includes(selected) ? selected : genders[0] ?? "";

  const setGender = (g: Gender) => dispatch(setGenderAction(g));

  return { gender, setGender, genders, navByGender, isLoading };
}
