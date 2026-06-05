"use client";

import { RESOURCES } from "@/src/config/rbac";
import { useActions } from "@/src/hooks/useActions";
import { Check } from "lucide-react";

export type SelectedGrants = Record<string, string[]>;

interface ResourcePermissionMatrixProps {
  /** resource -> selected action keys */
  selected: SelectedGrants;
  onChange: (next: SelectedGrants) => void;
  /**
   * Optional ceiling. When provided, only these resources/actions are shown
   * and selectable (branch-scoped role forms). Omit for full scope.
   */
  scope?: SelectedGrants;
  readOnly?: boolean;
}

export default function ResourcePermissionMatrix({
  selected,
  onChange,
  scope,
  readOnly = false,
}: ResourcePermissionMatrixProps) {
  const { actions: catalog } = useActions();

  // Columns = dynamic action keys (filtered to scope union when capped).
  const allKeys = catalog.map((a) => a.key);
  const labelOf = (key: string) =>
    catalog.find((a) => a.key === key)?.label ?? key;

  const resources = scope
    ? RESOURCES.filter((r) => (scope[r]?.length ?? 0) > 0)
    : [...RESOURCES];

  const actionsFor = (resource: string): string[] =>
    scope ? scope[resource] ?? [] : allKeys;

  const isSelected = (resource: string, action: string) =>
    selected[resource]?.includes(action) ?? false;

  const toggle = (resource: string, action: string) => {
    if (readOnly) return;
    const current = selected[resource] ?? [];
    const next = current.includes(action)
      ? current.filter((a) => a !== action)
      : [...current, action];
    const out = { ...selected };
    if (next.length) out[resource] = next;
    else delete out[resource];
    onChange(out);
  };

  const toggleRow = (resource: string) => {
    if (readOnly) return;
    const available = actionsFor(resource);
    const current = selected[resource] ?? [];
    const allOn = available.every((a) => current.includes(a));
    const out = { ...selected };
    if (allOn) delete out[resource];
    else out[resource] = [...available];
    onChange(out);
  };

  if (resources.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic py-3">
        No resources available in this scope.
      </p>
    );
  }
  if (allKeys.length === 0) {
    return (
      <p className="text-xs text-gray-400 italic py-3">
        No actions defined yet. Create actions first.
      </p>
    );
  }

  const columns = allKeys;

  return (
    <div className="border border-gray-100 rounded-xl overflow-x-auto">
      <div
        className="grid bg-gray-50 border-b border-gray-100 min-w-max"
        style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, minmax(72px,1fr))` }}
      >
        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          Resource
        </div>
        {columns.map((a) => (
          <div
            key={a}
            className="px-2 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center"
          >
            {labelOf(a)}
          </div>
        ))}
      </div>

      {resources.map((resource) => {
        const available = actionsFor(resource);
        return (
          <div
            key={resource}
            className="grid border-b border-gray-50 last:border-0 items-center min-w-max"
            style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, minmax(72px,1fr))` }}
          >
            <button
              type="button"
              onClick={() => toggleRow(resource)}
              disabled={readOnly}
              className={`px-3 py-2.5 text-left text-xs font-semibold text-gray-700 capitalize ${
                readOnly ? "cursor-default" : "cursor-pointer hover:text-primary"
              }`}
            >
              {resource}
            </button>

            {columns.map((action) => {
              const allowed = available.includes(action);
              const checked = isSelected(resource, action);
              return (
                <div key={action} className="flex items-center justify-center py-2.5">
                  {allowed ? (
                    <button
                      type="button"
                      onClick={() => toggle(resource, action)}
                      disabled={readOnly}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked ? "bg-primary border-primary" : "border-gray-300 bg-white"
                      } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                    >
                      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </button>
                  ) : (
                    <span className="w-4 h-4 rounded bg-gray-50 border border-dashed border-gray-200" />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
