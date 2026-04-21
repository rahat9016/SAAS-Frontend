"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import CreateUpdateParentCategory from "../Form/CreateUpdateParentCategory";
import { GetParentCategoryColumns } from "../TableColumns/ParentCategoryColumns";
import { IParentCategory } from "../types";

export default function ParentCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    IParentCategory | undefined
  >();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } =
    useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const { data, isLoading } = useGet<IParentCategory[]>(
    "/parent-category",
    [
      "parent-categories",
      currentPage.toString(),
      itemsPerPage.toString(),
      debouncedSearch,
      sortBy,
    ],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
      ...(sortBy && { status: sortBy }),
    }
  );

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Parent category deleted successfully!");
  }, [["parent-categories"]]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IParentCategory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutate({ url: `/parent-category/${deleteId}` });
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetParentCategoryColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateParentCategory
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Parent Category"
        description="Are you sure you want to delete this parent category? This action cannot be undone."
      />
    </div>
  );
}
