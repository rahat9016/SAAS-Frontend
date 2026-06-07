"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RolesTable from "../RolesTable";
import CreateUpdateRole from "../Form/CreateUpdateRole";
import { GetRoleColumns } from "../TableColumns/RoleColumns";
import { RbacRoleItem } from "../types";

export default function RoleList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacRoleItem | undefined>();
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

  const { data, isLoading } = useGet<RbacRoleItem[]>(
    "/api/super-admin/roles",
    ["rbac-roles", currentPage.toString(), itemsPerPage.toString(), debouncedSearch],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
    },
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
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id),
  );

  return (
    <div>
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
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateRole
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(undefined);
        }}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutate({ url: `/api/super-admin/roles/${deleteId}` });
        }}
        title="Delete Role"
        description="Users with this role keep their account but lose the role label."
      />
    </div>
  );
}
