"use client";
import Cookies from "js-cookie";

import { useEffect, useMemo } from "react";
import { useGet } from "../hooks/useGet";
import { setUserInformation } from "../lib/redux/features/auth/authSlice";
import { useAppDispatch } from "../lib/redux/hooks";
import { decodedToken } from "../services/jwt";

export const UserFetcher = () => {
  const dispatch = useAppDispatch();
  const accessToken = Cookies.get("accessToken");

  // Decode userId from the JWT accessToken (secure — token is signed by backend)
  const decodedUserId = useMemo(() => {
    if (!accessToken) return "";
    try {
      const decoded = decodedToken(accessToken) as {
        id?: string;
        userId?: string;
        sub?: string;
      };
      return String(decoded.id || decoded.userId || decoded.sub || "");
    } catch {
      return "";
    }
  }, [accessToken]);

  const { data, isSuccess, isLoading } = useGet(
    `/user/${decodedUserId}`,
    ["user", decodedUserId || ""],
    undefined,
    {
      enabled: !!decodedUserId,
      staleTime: 5 * 60 * 1000,
    }
  );

  // If user data is available, set it in the store
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUserInformation(data.data));
    }
  }, [isSuccess, data, dispatch, isLoading]);

  return null;
};
