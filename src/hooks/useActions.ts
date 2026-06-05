"use client";

import { useGet } from "@/src/hooks/useGet";

export interface ActionItem {
  id: string;
  key: string;
  label: string;
  isBuiltIn: boolean;
  createdAt: string;
}

/** Dynamic action catalog (the "attributes") for the permission matrix. */
export function useActions() {
  const { data, isLoading } = useGet<ActionItem[]>("/api/actions", ["actions-catalog"]);
  const actions = data?.data ?? [];
  return { actions, actionKeys: actions.map((a) => a.key), isLoading };
}
