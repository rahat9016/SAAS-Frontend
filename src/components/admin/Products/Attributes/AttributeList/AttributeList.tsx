"use client";

import { useState } from "react";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Palette } from "lucide-react";
import AttributesTable from "../AttributesTable";
import { GetAttributeColumns } from "../TableColumns/AttributeColumns";
import CreateUpdateAttribute from "../Form/CreateUpdateAttribute";
import { IAttribute } from "../types";

// ─── Mock data (replace with API later) ─────────────────────────────
const INITIAL_ATTRIBUTES: IAttribute[] = [
  { id: "attr-1", name: "Color" },
  { id: "attr-2", name: "Size" },
  { id: "attr-3", name: "Storage" },
  { id: "attr-4", name: "Material" },
];

export default function AttributeList() {
  const [attributes, setAttributes] = useState<IAttribute[]>(INITIAL_ATTRIBUTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAttribute | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<IAttribute | undefined>();

  const handleView = (item: IAttribute) => {
    setViewItem(item);
  };

  const handleEdit = (item: IAttribute) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setAttributes((prev) => prev.filter((a) => a.id !== deleteId));
      toast.success("Attribute deleted successfully!");
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetAttributeColumns(handleView, handleEdit, handleDelete);

  return (
    <div>
      <AttributesTable
        columns={columns}
        data={attributes}
        isLoading={false}
        totalItems={attributes.length}
        currentPage={1}
        itemsPerPage={10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search=""
        handleSearchChange={() => {}}
        showCreateButton
        createTitle="Create Attribute"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
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

      {/* View Attribute Modal */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(undefined)}>
        <DialogContent className="bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-secondary text-xl font-semibold">
              Attribute Details
            </DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-4 bg-light rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Attribute Name</p>
                  <p className="text-base font-semibold text-secondary">
                    {viewItem.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-400 mb-0.5">ID</p>
                  <p className="text-sm font-medium text-secondary">
                    {viewItem.id}
                  </p>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-400 mb-0.5">Type</p>
                  <p className="text-sm font-medium text-secondary">
                    Product Attribute
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
