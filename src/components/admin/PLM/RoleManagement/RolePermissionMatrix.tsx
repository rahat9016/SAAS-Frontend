"use client";

import { PlmPermission, ALL_PLM_PERMISSIONS } from "@/src/types/plm/plmPermissions";
import { Check } from "lucide-react";

// Group permissions by domain for a clear matrix layout
const PERMISSION_GROUPS: { label: string; permissions: PlmPermission[] }[] = [
  {
    label: "Dashboard",
    permissions: ["plm.dashboard.view"],
  },
  {
    label: "Branch",
    permissions: ["plm.branch.view", "plm.branch.create", "plm.branch.delete"],
  },
  {
    label: "Design",
    permissions: [
      "plm.design.view",
      "plm.design.create",
      "plm.design.submit",
      "plm.design.advance",
    ],
  },
  {
    label: "Moderation",
    permissions: [
      "plm.moderation.review",
      "plm.moderation.approve",
      "plm.moderation.reject",
      "plm.moderation.sendToAdmin",
    ],
  },
  {
    label: "Approval",
    permissions: ["plm.approval.decide"],
  },
  {
    label: "Production",
    permissions: ["plm.production.view", "plm.production.advance"],
  },
  {
    label: "Inventory",
    permissions: ["plm.inventory.view", "plm.inventory.manage"],
  },
];

const PERMISSION_LABEL: Record<PlmPermission, string> = {
  "plm.dashboard.view": "View Dashboard",
  "plm.branch.view": "View Branches",
  "plm.branch.create": "Create Branch",
  "plm.branch.delete": "Delete Branch",
  "plm.design.view": "View Designs",
  "plm.design.create": "Create Design",
  "plm.design.submit": "Submit Design",
  "plm.design.advance": "Advance Status",
  "plm.moderation.review": "Review Submissions",
  "plm.moderation.approve": "Approve Design",
  "plm.moderation.reject": "Reject Design",
  "plm.moderation.sendToAdmin": "Send to Admin",
  "plm.approval.decide": "Approval Decision",
  "plm.production.view": "View Production",
  "plm.production.advance": "Advance Production",
  "plm.inventory.view": "View Inventory",
  "plm.inventory.manage": "Manage Inventory",
};

interface RolePermissionMatrixProps {
  selected: PlmPermission[];
  onChange: (permissions: PlmPermission[]) => void;
  readOnly?: boolean;
}

export default function RolePermissionMatrix({
  selected,
  onChange,
  readOnly = false,
}: RolePermissionMatrixProps) {
  const toggle = (perm: PlmPermission) => {
    if (readOnly) return;
    if (selected.includes(perm)) {
      onChange(selected.filter((p) => p !== perm));
    } else {
      onChange([...selected, perm]);
    }
  };

  const toggleGroup = (permissions: PlmPermission[]) => {
    if (readOnly) return;
    const allSelected = permissions.every((p) => selected.includes(p));
    if (allSelected) {
      onChange(selected.filter((p) => !permissions.includes(p)));
    } else {
      const newSet = new Set([...selected, ...permissions]);
      onChange(Array.from(newSet));
    }
  };

  const selectAll = () => {
    if (readOnly) return;
    onChange([...ALL_PLM_PERMISSIONS]);
  };

  const clearAll = () => {
    if (readOnly) return;
    onChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Select All / Clear All */}
      {!readOnly && (
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Permissions ({selected.length}/{ALL_PLM_PERMISSIONS.length})
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-gray-400 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Permission Groups */}
      {PERMISSION_GROUPS.map((group) => {
        const allSelected = group.permissions.every((p) => selected.includes(p));
        const someSelected = group.permissions.some((p) => selected.includes(p));

        return (
          <div key={group.label} className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Group Header */}
            <button
              type="button"
              onClick={() => toggleGroup(group.permissions)}
              disabled={readOnly}
              className={`w-full flex items-center gap-2 px-3 py-2 border-b border-gray-100 ${
                readOnly ? "cursor-default" : "cursor-pointer hover:bg-gray-100"
              } transition-colors`}
            >
              {/* Group checkbox indicator */}
              <div
                className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                  allSelected
                    ? "bg-primary border-primary"
                    : someSelected
                    ? "bg-primary/30 border-primary/50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {(allSelected || someSelected) && (
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                )}
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {group.label}
              </span>
              <span className="ml-auto text-[10px] text-gray-400">
                {group.permissions.filter((p) => selected.includes(p)).length}/
                {group.permissions.length}
              </span>
            </button>

            {/* Individual permissions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {group.permissions.map((perm) => {
                const isChecked = selected.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => toggle(perm)}
                    disabled={readOnly}
                    className={`flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      readOnly ? "cursor-default" : "cursor-pointer hover:bg-gray-100"
                    } ${isChecked ? "bg-primary/5" : ""}`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-primary border-primary"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700">
                        {PERMISSION_LABEL[perm]}
                      </p>
                      <code className="text-[9px] text-gray-400">{perm}</code>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
