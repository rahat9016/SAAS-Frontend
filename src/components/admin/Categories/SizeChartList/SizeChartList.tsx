"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import ProductAttributesTable from "../ProductAttributesTable";
import { ISize, mockSizesList } from "../data/mockSizeData";
import CreateUpdateSize from "../Form/CreateUpdateSize";
import ViewSizeModal from "../Form/ViewSizeModal";
import { SizeFormValues } from "../Schema/sizeSchema";
import { GetSizeColumns } from "../TableColumns/SizeColumns";

export default function SizeChartList() {
  const [sizes, setSizes] = useState<ISize[]>(mockSizesList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISize | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<ISize | undefined>();

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleView = (item: ISize) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewItem(undefined);
  };

  const handleEdit = (item: ISize) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setSizes((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: SizeFormValues) => {
    if (selectedItem) {
      setSizes((prev) =>
        prev
          .map((item) =>
            item.id === selectedItem.id ? { ...item, ...values } : item
          )
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setSizes((prev) =>
        [
          ...prev,
          {
            id,
            name: values.name,
            code: values.code,
            description: values.description,
            sortOrder: values.sortOrder,
            unit: values.unit,
            chest: values.chest,
            waist: values.waist,
            hip: values.hip,
            length: values.length,
            status: values.isActive ? "ACTIVE" : "INACTIVE",
            createdAt: new Date().toISOString(),
          },
        ].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
    }
    handleModalClose();
  };

  const filteredSizes = sizes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.code.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetSizeColumns(handleView, handleEdit, handleDelete);

  return (
    <div>
      <ProductAttributesTable
        columns={columns}
        data={filteredSizes}
        totalItems={filteredSizes.length}
        currentPage={1}
        itemsPerPage={filteredSizes.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateSize
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <ViewSizeModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        size={viewItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Size"
        description="Are you sure you want to delete this size? This action cannot be undone."
      />
    </div>
  );
}
