"use client";
import Cookies from "js-cookie";

import { useEffect, useMemo, useState } from "react";
import { useGet } from "../hooks/useGet";
import {
  setLoading,
  setUserInformation,
} from "../lib/redux/features/auth/authSlice";
import { IUserInformation } from "../lib/redux/features/auth/authTypes";
import { setPermissionsFromRole } from "../lib/redux/features/permission/permissionSlice";
import { setUserProfile } from "../lib/redux/features/plm/plmSlice";
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

  const { data, isSuccess, isError, isFetching } = useGet<IUserInformation>(
    `/user/${decodedUserId}`,
    ["user", decodedUserId || ""],
    undefined,
    {
      enabled: !!decodedUserId,
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    dispatch(setLoading(Boolean(decodedUserId) && isFetching));
  }, [decodedUserId, isFetching, dispatch]);

  // If user data is available, set it in the store
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUserInformation(data.data));
      dispatch(setPermissionsFromRole(data.data.role));
      dispatch(setLoading(false));

      // Auto-set PLM user profile from real auth data when backend provides plmRoles.
      // Falls back to the dev-mode switcher when plmRoles is not present.
      if (data.data.plmRoles && data.data.plmRoles.length > 0) {
        dispatch(
          setUserProfile({
            id: data.data.id,
            name: `${data.data.firstName} ${data.data.lastName}`.trim(),
            roles: data.data.plmRoles,
            permissions: (data.data as IUserInformation & { plmPermissions?: string[] }).plmPermissions || [],
            branchId: data.data.branchId ?? null,
            branchName: data.data.branchName ?? null,
          })
        );
      }
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (!decodedUserId) {
      dispatch(setUserInformation({}));
      dispatch(setPermissionsFromRole(null));
      dispatch(setLoading(false));
      return;
    }

    if (isError) {
      dispatch(setLoading(false));
    }
  }, [decodedUserId, isError, dispatch]);

  return null;
};
