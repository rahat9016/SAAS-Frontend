"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RbacUser } from "@/src/types/rbac/rbac";
import PermissionsTable from "../PermissionsTable";
import PermissionViewModal from "../PermissionViewModal";
import { GetPermissionColumns } from "../TableColumns/PermissionColumns";

export default function PermissionList() {
  const router = useRouter();
  const [viewUser, setViewUser] = useState<RbacUser | null>(null);

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } = useSearchDebounce(300);

  const { data, isLoading } = useGet<RbacUser[]>(
    "/api/branches/users",
    ["rbac-users", currentPage.toString(), itemsPerPage.toString(), debouncedSearch],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
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
    <div>
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
