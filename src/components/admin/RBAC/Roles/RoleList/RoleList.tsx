"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  selectRbac,
  selectIsSuperAdmin,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { scopeToMap, type RbacBranch } from "@/src/types/rbac/rbac";
import type { PermissionMap } from "@/src/config/rbac";
import type { SelectedGrants } from "../../shared/ResourcePermissionMatrix";
import RolesTable from "../RolesTable";
import CreateUpdateRole from "../Form/CreateUpdateRole";
import { GetRoleColumns } from "../TableColumns/RoleColumns";
import { RbacRole } from "../types";

type Scope = "SUPER_ADMIN" | "BRANCH";

/** Effective permission map → matrix grants (action keys that are true). */
function mapToGrants(map: PermissionMap): SelectedGrants {
  const out: SelectedGrants = {};
  for (const [resource, actions] of Object.entries(map ?? {})) {
    const on = Object.entries(actions)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (on.length) out[resource] = on;
  }
  return out;
}

export default function RoleList() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const rbac = useAppSelector(selectRbac);

  const [scope, setScope] = useState<Scope>(isSuperAdmin ? "SUPER_ADMIN" : "BRANCH");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RbacRole | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } = useSearchDebounce(300);

  // Branch list for the super-admin branch picker.
  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    { limit: "-1" },
    { enabled: isSuperAdmin && scope === "BRANCH" },
  );
  const branches = useMemo(() => branchData?.data ?? [], [branchData]);

  const isBranchScope = scope === "BRANCH";
  const basePath = isBranchScope ? "/api/branches/roles" : "/api/super-admin/roles";
  const activeBranchId = isSuperAdmin ? selectedBranchId : rbac.user.branchId ?? "";

  // Scope ceiling for the form matrix.
  const ceiling: SelectedGrants | undefined = useMemo(() => {
    if (!isBranchScope) return undefined; // global roles → full
    if (isSuperAdmin) {
      const b = branches.find((x) => x.id === selectedBranchId);
      return b ? scopeToMap(b.branchPermissions) : {};
    }
    return mapToGrants(rbac.permissions);
  }, [isBranchScope, isSuperAdmin, branches, selectedBranchId, rbac.permissions]);

  const ready = !isBranchScope || !isSuperAdmin || !!selectedBranchId;

  const { data, isLoading } = useGet<RbacRole[]>(
    basePath,
    [
      "rbac-roles",
      scope,
      activeBranchId,
      currentPage.toString(),
      itemsPerPage.toString(),
      debouncedSearch,
    ],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
      ...(isBranchScope && activeBranchId ? { branchId: activeBranchId } : {}),
    },
    { enabled: ready },
  );

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Role deleted successfully!");
    setDeleteId(null);
  }, [["rbac-roles"]]);

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = GetRoleColumns(
    (item) => {
      setEditing(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id),
  );

  return (
    <div className="space-y-4">
      {/* Scope tabs (super admin) + branch picker */}
      <div className="flex items-center gap-3 flex-wrap">
        {isSuperAdmin && (
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-white">
            {(["SUPER_ADMIN", "BRANCH"] as Scope[]).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`text-sm px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                  scope === s ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s === "SUPER_ADMIN" ? "Global Roles" : "Branch Roles"}
              </button>
            ))}
          </div>
        )}
        {isSuperAdmin && isBranchScope && (
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select branch…</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        )}
      </div>

      {!ready ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          Select a branch to manage its roles.
        </p>
      ) : (
        <RolesTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          search={search}
          showSearch
          handleSearchChange={handleSearchChange}
          showCreateButton
          createTitle="Create Role"
          setIsModalOpen={() => {
            setEditing(undefined);
            setIsModalOpen(true);
          }}
        />
      )}

      <CreateUpdateRole
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(undefined);
        }}
        initialValues={editing}
        basePath={basePath}
        branchId={isBranchScope && isSuperAdmin ? activeBranchId : undefined}
        ceiling={ceiling}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutate({ url: `${basePath}/${deleteId}` });
        }}
        title="Delete Role"
        description="Assigned users keep their account but lose this role."
      />
    </div>
  );
}
