"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { setRbacPermissions } from "@/src/lib/redux/features/rbac/rbacSlice";
import {
  selectRbacLoaded,
  selectRbacUser,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { fetchRbacPermissions } from "@/src/services/rbac.service";

/**
 * Loads the RBAC permission map from the API once and hydrates the redux
 * `rbac` slice. Call high in the tree (e.g. a route guard) — components then
 * read permissions via selectors (selectCan) without re-fetching.
 */
export function useRbacPermissions() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector(selectRbacLoaded);
  const user = useAppSelector(selectRbacUser);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rbac-permissions"],
    queryFn: fetchRbacPermissions,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      dispatch(
        setRbacPermissions({ user: data.user, permissions: data.permissions }),
      );
    }
  }, [data, dispatch]);

  return { loaded: loaded || !!data, user, isLoading, isError };
}
