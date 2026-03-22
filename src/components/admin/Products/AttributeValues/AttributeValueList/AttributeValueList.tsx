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
import { Tag } from "lucide-react";
import AttributeValuesTable from "../AttributeValuesTable";
import { GetAttributeValueColumns } from "../TableColumns/AttributeValueColumns";
import CreateUpdateAttributeValue from "../Form/CreateUpdateAttributeValue";
import { IAttributeValue } from "../types";

// ─── Mock data (replace with API later) ─────────────────────────────
const INITIAL_VALUES: IAttributeValue[] = [
  { id: "val-1", name: "Red", attributeId: "attr-1", attributeName: "Color" },
  { id: "val-2", name: "Blue", attributeId: "attr-1", attributeName: "Color" },
  { id: "val-3", name: "Black", attributeId: "attr-1", attributeName: "Color" },
  { id: "val-4", name: "White", attributeId: "attr-1", attributeName: "Color" },
  { id: "val-6", name: "S", attributeId: "attr-2", attributeName: "Size" },
  { id: "val-7", name: "M", attributeId: "attr-2", attributeName: "Size" },
  { id: "val-8", name: "L", attributeId: "attr-2", attributeName: "Size" },
  { id: "val-9", name: "XL", attributeId: "attr-2", attributeName: "Size" },
  { id: "val-11", name: "64 GB", attributeId: "attr-3", attributeName: "Storage" },
  { id: "val-12", name: "128 GB", attributeId: "attr-3", attributeName: "Storage" },
  { id: "val-13", name: "256 GB", attributeId: "attr-3", attributeName: "Storage" },
];

export default function AttributeValueList() {
  const [values, setValues] = useState<IAttributeValue[]>(INITIAL_VALUES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    IAttributeValue | undefined
  >();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<IAttributeValue | undefined>();

  const handleView = (item: IAttributeValue) => {
    setViewItem(item);
  };

  const handleEdit = (item: IAttributeValue) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setValues((prev) => prev.filter((v) => v.id !== deleteId));
      toast.success("Attribute value deleted successfully!");
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetAttributeValueColumns(handleView, handleEdit, handleDelete);

  return (
    <div>
      <AttributeValuesTable
        columns={columns}
        data={values}
        isLoading={false}
        totalItems={values.length}
        currentPage={1}
        itemsPerPage={10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search=""
        handleSearchChange={() => {}}
        showCreateButton
        createTitle="Create Attribute Value"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateAttributeValue
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Attribute Value"
        description="Are you sure you want to delete this attribute value? This action cannot be undone."
      />

      {/* View Attribute Value Modal */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(undefined)}>
        <DialogContent className="bg-white sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-secondary text-xl font-semibold">
              Attribute Value Details
            </DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-4 bg-light rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Value Name</p>
                  <p className="text-base font-semibold text-secondary">
                    {viewItem.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-400 mb-0.5">Attribute</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {viewItem.attributeName}
                  </span>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg">
                  <p className="text-xs text-gray-400 mb-0.5">ID</p>
                  <p className="text-sm font-medium text-secondary">
                    {viewItem.id}
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
