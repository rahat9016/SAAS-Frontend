"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  selectRbacUser,
  selectIsSuperAdmin,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { type RbacBranch } from "@/src/types/rbac/rbac";
import UsersTable from "../UsersTable";
import CreateUpdateUser from "../Form/CreateUpdateUser";
import { GetUserColumns } from "../TableColumns/UserColumns";
import { RbacBranchUser } from "../types";

export default function UserList() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const rbacUser = useAppSelector(selectRbacUser);

  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<RbacBranchUser | undefined>();
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

  const { data: branchData } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches"],
    { limit: "-1" },
    { enabled: isSuperAdmin },
  );
  const branches = useMemo(() => branchData?.data ?? [], [branchData]);
  const activeBranchId = isSuperAdmin ? selectedBranchId : rbacUser.branchId ?? "";
  const ready = !isSuperAdmin || !!selectedBranchId;

  const { data, isLoading } = useGet<RbacBranchUser[]>(
    "/api/branches/users",
    [
      "rbac-users",
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
      ...(isSuperAdmin && selectedBranchId ? { branchId: selectedBranchId } : {}),
    },
    { enabled: ready },
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
      setEditing(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id),
  );

  return (
    <div className="space-y-4">
      {isSuperAdmin && (
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

      {!ready ? (
        <p className="text-sm text-gray-400 py-8 text-center">
          Select a branch to manage its users.
        </p>
      ) : (
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
          createTitle="Add User"
          setIsModalOpen={() => {
            setEditing(undefined);
            setIsModalOpen(true);
          }}
        />
      )}

      <CreateUpdateUser
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(undefined);
        }}
        initialValues={editing}
        branchId={activeBranchId}
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
