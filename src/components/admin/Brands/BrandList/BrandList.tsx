"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useDelete } from "@/src/hooks/useDelete";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BrandsTable from "../BrandsTable";
import { GetBrandColumns } from "../TableColumns/BrandColumns";
import { IBrand } from "../types";
import CreateUpdateBrand from "../Form/CreateUpdateBrand";

export default function BrandList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IBrand | undefined>();
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

  const { data, isLoading } = useGet<IBrand[]>(
    "/api/brands",
    [
      "brands",
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

  const { mutate: deleteMutate } = useDelete(
    () => {
      toast.success("Brand deleted successfully!");
    },
    [["brands"]]
  );

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IBrand) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutate({ url: `/api/brands/${deleteId}` });
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetBrandColumns(handleEdit, handleDelete);

  return (
    <div>
      <BrandsTable
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
        createTitle="Create Brand"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateBrand
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </div>
  );
}
