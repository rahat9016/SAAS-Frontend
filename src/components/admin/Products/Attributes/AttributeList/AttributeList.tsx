"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AttributesTable from "../AttributesTable";
import CreateUpdateAttribute from "../Form/CreateUpdateAttribute";
import { GetAttributeColumns } from "../TableColumns/AttributeColumns";
import { IAttribute } from "../types";

export default function AttributeList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAttribute | undefined>();
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

  const { data, isLoading } = useGet<IAttribute[]>(
    "/product-attribute",
    [
      "product-attributes",
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
    toast.success("Attribute deleted successfully!");
  }, [["product-attributes"]]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IAttribute) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutate({ url: `/product-attribute/${deleteId}` });
    setDeleteId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetAttributeColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-4">
      <AttributesTable
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
        createTitle="Create Attribute"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
        title="Product Attributes"
        tabs={[
          { name: "Attribute", route: "/admin/products/attributes" },
          {
            name: "Attribute Value",
            route: "/admin/products/attribute-values",
          },
        ]}
      />

      <CreateUpdateAttribute
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValues={selectedItem}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Attribute"
        description="Are you sure you want to delete this attribute? This action cannot be undone."
      />
    </div>
  );
}
