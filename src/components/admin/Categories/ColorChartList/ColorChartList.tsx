"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import ProductAttributesTable from "../ProductAttributesTable";
import { IColor, mockColorsList } from "../data/mockColorData";
import CreateUpdateColor from "../Form/CreateUpdateColor";
import ViewColorModal from "../Form/ViewColorModal";
import { ColorFormValues } from "../Schema/colorSchema";
import { GetColorColumns } from "../TableColumns/ColorColumns";

export default function ColorChartList() {
  const [colors, setColors] = useState<IColor[]>(mockColorsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IColor | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<IColor | undefined>();

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleView = (item: IColor) => {
    setViewItem(item);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewItem(undefined);
  };

  const handleEdit = (item: IColor) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setColors((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: ColorFormValues) => {
    if (selectedItem) {
      setColors((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setColors((prev) => [
        ...prev,
        {
          id,
          name: values.name,
          code: values.code,
          description: values.description,
          status: values.isActive ? "ACTIVE" : "INACTIVE",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    handleModalClose();
  };

  const filteredColors = colors.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.code.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetColorColumns(handleView, handleEdit, handleDelete);

  return (
    <div>
      <ProductAttributesTable
        columns={columns}
        data={filteredColors}
        totalItems={filteredColors.length}
        currentPage={1}
        itemsPerPage={filteredColors.length || 10}
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
      <CreateUpdateColor
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <ViewColorModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        color={viewItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Color"
        description="Are you sure you want to delete this color? This action cannot be undone."
      />
    </div>
  );
}
