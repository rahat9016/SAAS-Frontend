import { BUILT_IN_ACTIONS } from "@/src/config/rbac";
import { IActionItem } from "../types";

// Local action catalogue used until /api/super-admin/actions is live.
// The five BUILT_IN_ACTIONS are seeded first (delete-protected), then the
// custom keys, which apply to every resource in the permission matrix.
const builtInLabels: Record<string, string> = {
  CREATE: "Create",
  READ: "Read",
  UPDATE: "Update",
  DELETE: "Delete",
  EXPORT: "Export",
};

export const mockActionsList: IActionItem[] = [
  ...BUILT_IN_ACTIONS.map((key, index) => ({
    id: `ACT-100${index + 1}`,
    key,
    label: builtInLabels[key] ?? key,
    isBuiltIn: true,
    createdAt: "2025-08-01",
  })),
  {
    id: "ACT-2001",
    key: "APPROVE",
    label: "Approve",
    isBuiltIn: false,
    createdAt: "2025-11-16",
  },
  {
    id: "ACT-2002",
    key: "PUBLISH",
    label: "Publish",
    isBuiltIn: false,
    createdAt: "2026-01-09",
  },
];
