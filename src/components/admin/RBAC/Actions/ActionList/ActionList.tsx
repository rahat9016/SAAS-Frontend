"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ActionsTable from "../ActionsTable";
import CreateUpdateAction from "../Form/CreateUpdateAction";
import { GetActionColumns } from "../TableColumns/ActionColumns";
import { IActionItem } from "../types";

export default function ActionList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IActionItem | undefined>();
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

  const { data, isLoading } = useGet<IActionItem[]>(
    "/api/super-admin/actions",
    ["actions", currentPage.toString(), itemsPerPage.toString(), debouncedSearch],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
    },
  );

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Action deleted successfully!");
  }, [["actions"], ["actions-catalog"]]);

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const columns = GetActionColumns(handleEdit, (id) => setDeleteId(id));

  return (
    <div>
      <ActionsTable
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
        createTitle="Create Action"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateAction
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
          if (deleteId) deleteMutate({ url: `/api/super-admin/actions/${deleteId}` });
          setDeleteId(null);
        }}
        title="Delete Action"
        description="Roles using this action will lose it. Built-in actions cannot be deleted."
      />
    </div>
  );
}
