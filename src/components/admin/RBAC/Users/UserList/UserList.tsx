"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import UsersTable from "../UsersTable";
import CreateUpdateUser from "../Form/CreateUpdateUser";
import { GetUserColumns } from "../TableColumns/UserColumns";
import { RbacBranch, RbacUser } from "../types";

// Scope filter value: "" = all, "platform" = no branch, otherwise a branchId.
function scopeParams(scope: string) {
  if (scope === "platform") return { platform: "true" };
  if (scope) return { branchId: scope };
  return {};
}

export default function UserList() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacUser | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("User deleted successfully!");
    setDeleteId(null);
  }, [["rbac-users"]]);

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = GetUserColumns(
    (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id),
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
      <UsersTable
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
        createTitle="Create User"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateUser
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(undefined);
        }}
        initialValues={selectedItem}
        isSuperAdmin={isSuperAdmin}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutate({ url: `/api/branches/users/${deleteId}` });
        }}
        title="Delete User"
        description="This permanently removes the user account."
      />
    </div>
  );
}
