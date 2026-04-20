"use client";
import Cookies from "js-cookie";

import { useEffect, useMemo, useState } from "react";
import { useGet } from "../hooks/useGet";
import { setUserInformation } from "../lib/redux/features/auth/authSlice";
import { useAppDispatch } from "../lib/redux/hooks";
import { decodedToken } from "../services/jwt";

export const UserFetcher = () => {
  const dispatch = useAppDispatch();
  const [accessToken, setAccessToken] = useState(
    () => Cookies.get("accessToken") || ""
  );

  useEffect(() => {
    const syncAccessToken = () => {
      setAccessToken(Cookies.get("accessToken") || "");
    };

    window.addEventListener("auth-token-updated", syncAccessToken);
    window.addEventListener("focus", syncAccessToken);
    document.addEventListener("visibilitychange", syncAccessToken);

    return () => {
      window.removeEventListener("auth-token-updated", syncAccessToken);
      window.removeEventListener("focus", syncAccessToken);
      document.removeEventListener("visibilitychange", syncAccessToken);
    };
  }, []);

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

  const { data, isSuccess } = useGet(
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
  }, [isSuccess, data, dispatch]);

  return null;
};
