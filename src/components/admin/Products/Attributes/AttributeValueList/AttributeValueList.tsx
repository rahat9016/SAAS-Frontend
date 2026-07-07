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
import { GetAttributeValueColumns } from "../TableColumns/AttributeValueColumns";
import { IAttributeValue } from "../types";

export default function AttributeValueList() {
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    IAttributeValue | undefined
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

  // const { data: attributesData } = useGet<IAttribute[]>(
  //   "/product-attribute/values/all",
  //   ["product-attributes-for-values"]
  // );

  const { data, isLoading } = useGet<IAttributeValue[]>(
    "/product-attribute/values/list",
    [
      "productvalues-list",
      selectedAttributeId,
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

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributeId]);

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Attribute value deleted successfully!");
  }, [["product-attribute-values", selectedAttributeId]]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IAttributeValue) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId || !selectedAttributeId) return;
    deleteMutate({
      url: `/product-attribute/${selectedAttributeId}/values/${deleteId}`,
    });
    setDeleteId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetAttributeValueColumns(handleEdit, handleDelete);

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
        createTitle="Create"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
        title="Attribute Values"
        searchPlaceholder="Search values..."
        tabs={[
          { name: "Attribute", route: "/admin/products/attributes" },
          {
            name: "Attribute Value",
            route: "/admin/products/attribute-values",
          },
        ]}
      />

      {/* <CreateUpdateAttributeValue
        isOpen={isModalOpen}
        onClose={handleModalClose}
        attributeId={selectedAttributeId}
        initialValues={selectedItem}
      /> */}

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Attribute Value"
        description="Are you sure you want to delete this attribute value? This action cannot be undone."
      />
    </div>
  );
}
