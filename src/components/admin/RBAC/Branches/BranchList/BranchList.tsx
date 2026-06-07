"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BranchesTable from "../BranchesTable";
import CreateUpdateBranch from "../Form/CreateUpdateBranch";
import { GetBranchColumns } from "../TableColumns/BranchColumns";
import { RbacBranch } from "../types";

export default function BranchList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacBranch | undefined>();
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

  const { data, isLoading } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches", currentPage.toString(), itemsPerPage.toString(), debouncedSearch],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
    },
  );

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Branch deleted successfully!");
    setDeleteId(null);
  }, [["rbac-branches"]]);

  const { mutate: patchMutate } = usePatch(() => {
    toast.success("Branch status updated!");
  }, [["rbac-branches"]]);

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = GetBranchColumns(
    (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id),
    (item) =>
      patchMutate({
        url: `/api/super-admin/branches/${item.id}`,
        data: { status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
      }),
  );

  return (
    <div>
      <BranchesTable
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
        createTitle="Create Branch"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateBranch
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
          if (deleteId) deleteMutate({ url: `/api/super-admin/branches/${deleteId}` });
        }}
        title="Delete Branch"
        description="This permanently removes the branch. Users keep their account but lose the branch link."
      />
    </div>
  );
}
