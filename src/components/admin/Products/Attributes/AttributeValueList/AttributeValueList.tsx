"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AttributesTable from "../AttributesTable";
import CreateUpdateAttributeValue from "../Form/CreateUpdateAttributeValue";
import { GetAttributeValueColumns } from "../TableColumns/AttributeValueColumns";
import { IAttribute, IAttributeValue } from "../types";

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

  const { data: attributesData } = useGet<IAttribute[]>(
    "/product-attribute/values/list",
    ["product-attributes-for-values"],
    { page: "1", limit: "100" }
  );

  const attributeOptions = useMemo(
    () =>
      (attributesData?.data || []).map((item) => ({
        label: item.name,
        value: item.id,
      })),
    [attributesData]
  );

  useEffect(() => {
    if (!selectedAttributeId && attributeOptions.length > 0) {
      setSelectedAttributeId(attributeOptions[0].value);
    }
  }, [attributeOptions, selectedAttributeId]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttributeId]);

  const { data, isLoading } = useGet<IAttributeValue[]>(
    '/product-attribute/values/list',
    [
      "product-attribute-values",
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
    },
    {
      enabled: !!selectedAttributeId,
    }
  );

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

  const rightComponents = (
    <div className="w-52">
      <Select
        value={selectedAttributeId}
        onValueChange={setSelectedAttributeId}
      >
        <SelectTrigger className="h-11 bg-white border border-light-dark">
          <SelectValue placeholder="Select attribute" />
        </SelectTrigger>
        <SelectContent>
          {attributeOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div>
      {attributeOptions.length === 0 ? (
        <div className="bg-white rounded-lg border border-light-dark p-8 text-center text-sm text-gray-500">
          No attributes found. Create an attribute first to manage values.
        </div>
      ) : (
        <>
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
            createTitle="Create Attribute Value"
            setIsModalOpen={() => {
              setSelectedItem(undefined);
              setIsModalOpen(true);
            }}
            title="Attribute Values"
            rightComponents={rightComponents}
            searchPlaceholder="Search values..."
            tabs={[
              { name: "Attribute", route: "/admin/products/attributes" },
              {
                name: "Attribute Value",
                route: "/admin/products/attribute-values",
              },
            ]}
          />

          <CreateUpdateAttributeValue
            isOpen={isModalOpen}
            onClose={handleModalClose}
            attributeId={selectedAttributeId}
            initialValues={selectedItem}
          />

          <DeleteConfirmDialog
            isOpen={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Attribute Value"
            description="Are you sure you want to delete this attribute value? This action cannot be undone."
          />
        </>
      )}
    </div>
  );
}
