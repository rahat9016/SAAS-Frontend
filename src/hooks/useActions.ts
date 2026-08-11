"use client";

import { mockActionsList } from "@/src/components/admin/RBAC/Actions/data/mockActionData";

export interface ActionItem {
  id: string;
  key: string;
  label: string;
  isBuiltIn: boolean;
  createdAt: string;
}

/**
 * Dynamic action catalog (the "attributes") for the permission matrix.
 * TODO: restore the useGet("/api/actions", ["actions-catalog"]) call once the
 * RBAC backend is live; served from mock data until then.
 */
export function useActions() {
  const actions: ActionItem[] = mockActionsList;
  return { actions, actionKeys: actions.map((a) => a.key), isLoading: false };
}
