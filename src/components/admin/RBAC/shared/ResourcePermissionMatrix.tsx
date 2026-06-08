"use client";

import { RESOURCES, applicableActions } from "@/src/config/rbac";
import { useActions } from "@/src/hooks/useActions";
import { Check } from "lucide-react";

export type SelectedGrants = Record<string, string[]>;

interface ResourcePermissionMatrixProps {
  /** resource -> selected action keys */
  selected: SelectedGrants;
  onChange: (next: SelectedGrants) => void;
  /**
   * Optional ceiling. When provided, only these resources/actions are shown
   * and selectable (branch-scoped role/permission forms). Omit for full scope.
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
  const catalogKeys = catalog.map((a) => a.key);
  const labelOf = (key: string) => catalog.find((a) => a.key === key)?.label ?? key;

  // Resources to render (filtered to the ceiling when provided).
  const resourceDefs = RESOURCES.filter((r) =>
    scope ? (scope[r.key]?.length ?? 0) > 0 : true,
  );

  // Actions valid for a resource = its applicable actions (∩ ceiling if given).
  const actionsFor = (resourceKey: string): string[] => {
    const applicable = applicableActions(resourceKey, catalogKeys);
    if (!scope) return applicable;
    const allowed = new Set(scope[resourceKey] ?? []);
    return applicable.filter((a) => allowed.has(a));
  };

  // Columns = union of every applicable action across the shown resources.
  const columns = catalogKeys.filter((k) =>
    resourceDefs.some((r) => actionsFor(r.key).includes(k)),
  );

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

  const toggleRow = (resourceKey: string) => {
    if (readOnly) return;
    const available = actionsFor(resourceKey);
    const current = selected[resourceKey] ?? [];
    const allOn = available.every((a) => current.includes(a));
    const out = { ...selected };
    if (allOn) delete out[resourceKey];
    else out[resourceKey] = [...available];
    onChange(out);
  };

  if (resourceDefs.length === 0) {
    return <p className="text-xs text-gray-400 italic py-3">No resources available in this scope.</p>;
  }
  if (columns.length === 0) {
    return <p className="text-xs text-gray-400 italic py-3">No actions defined yet. Create actions first.</p>;
  }

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

      {resourceDefs.map((r) => {
        const available = actionsFor(r.key);
        return (
          <div
            key={r.key}
            className="grid border-b border-gray-50 last:border-0 items-center min-w-max"
            style={{ gridTemplateColumns: `1.4fr repeat(${columns.length}, minmax(72px,1fr))` }}
          >
            <button
              type="button"
              onClick={() => toggleRow(r.key)}
              disabled={readOnly}
              className={`px-3 py-2.5 text-left text-xs font-semibold text-gray-700 ${
                readOnly ? "cursor-default" : "cursor-pointer hover:text-primary"
              }`}
            >
              {r.label}
            </button>

            {columns.map((action) => {
              const allowed = available.includes(action);
              const checked = isSelected(r.key, action);
              return (
                <div key={action} className="flex items-center justify-center py-2.5">
                  {allowed ? (
                    <button
                      type="button"
                      onClick={() => toggle(r.key, action)}
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
