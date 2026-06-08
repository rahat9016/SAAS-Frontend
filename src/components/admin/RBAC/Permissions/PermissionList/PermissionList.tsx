"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RbacBranch, RbacUser } from "@/src/types/rbac/rbac";
import PermissionsTable from "../PermissionsTable";
import PermissionViewModal from "../PermissionViewModal";
import { GetPermissionColumns } from "../TableColumns/PermissionColumns";

// Scope filter value: "" = all, "platform" = no branch, otherwise a branchId.
function scopeParams(scope: string) {
  if (scope === "platform") return { platform: "true" };
  if (scope) return { branchId: scope };
  return {};
}

export default function PermissionList() {
  const router = useRouter();
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const [viewUser, setViewUser] = useState<RbacUser | null>(null);
  const [scope, setScope] = useState("");

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } = useSearchDebounce(300);

  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    { limit: "-1" },
    { enabled: isSuperAdmin },
  );
  const branches = useMemo(() => branchData?.data ?? [], [branchData]);

  const { data, isLoading } = useGet<RbacUser[]>(
    "/api/branches/users",
    ["rbac-users", currentPage.toString(), itemsPerPage.toString(), debouncedSearch, scope],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
      ...scopeParams(scope),
    },
  );

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Super admins have implicit full access — not part of per-user mapping.
  const rows = (data?.data || []).filter((u) => !u.role?.isSuperAdmin);

  const columns = GetPermissionColumns(
    (item) => setViewUser(item),
    (item) => router.push(`/admin/rbac/permissions/${item.id}`),
  );

  return (
    <div className="space-y-3">
      {isSuperAdmin && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Scope:</span>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All users</option>
            <option value="platform">Platform (no branch)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                Branch · {b.code ?? b.id.slice(0, 6)}
              </option>
            ))}
          </select>
        </div>
      )}
      <PermissionsTable
        columns={columns}
        data={rows}
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
        createTitle="Create Permission"
        setIsModalOpen={() => router.push("/admin/rbac/permissions/create")}
      />
      <PermissionViewModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  );
}
