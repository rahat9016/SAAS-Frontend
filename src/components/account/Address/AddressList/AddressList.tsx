"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { Check, Edit3, MapPin, Phone, Plus, Trash2, User } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CreateUpdateAddress from "../Form/CreateUpdateAddress";
import AddressListSkeleton from "../Skeleton/AddressListSkeleton";
import { IAddress } from "../types";

const getAddressId = (address: IAddress) => address.id || address._id || "";

export default function AddressList() {
  const { userInformation } = useAppSelector((state) => state.auth);
  const userId = userInformation?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAddress | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGet<IAddress[]>(
    `address/${userId}`,
    ["addresses", userId || ""],
    undefined,
    { enabled: !!userId }
  );

  const addresses = useMemo(() => data?.data || [], [data]);

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Address deleted successfully!");
    setDeleteId(null);
  }, [["addresses", userId || ""]]);

  const { mutate: setDefaultMutate } = usePatch(() => {
    toast.success("Default address updated successfully!");
  }, [["addresses", userId || ""]]);

  const handleOpenCreate = () => {
    setSelectedItem(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (item: IAddress) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: IAddress) => {
    const id = getAddressId(item);
    if (!id) {
      toast.error("Address id not found");
      return;
    }
    setDeleteId(id);
  };

  const handleSetDefault = (item: IAddress) => {
    const id = getAddressId(item);
    if (!id) {
      toast.error("Address id not found");
      return;
    }

    setDefaultMutate({
      url: `/address/${id}`,
      data: {
        isDefault: true,
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutate({ url: `/address/${deleteId}` });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  return (
    <div className="space-y-6 bg-light p-5 rounded-xl">
      <div className="flex items-center justify-between bg-primary/10 p-3 rounded-xl">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Address Book
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your delivery addresses
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Address</span>
        </button>
      </div>

      {isLoading ? (
        <AddressListSkeleton />
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 text-center min-h-68 flex items-center justify-center">
          No addresses found. Add your first address.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const itemId = getAddressId(addr);
            return (
              <div
                key={itemId}
                className={`relative bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
                  addr.isDefault
                    ? "border-primary/30 ring-1 ring-primary/10"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                    {addr.addressType}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Check size={12} />
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <User size={14} className="text-gray-400 shrink-0" />
                    {addr.fullName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    {addr.phone}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin
                      size={14}
                      className="text-gray-400 shrink-0 mt-0.5"
                    />
                    <span>
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                      <br />
                      {addr.area}, {addr.city}, {addr.region}, {addr.country}{" "}
                      {addr.zipCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => handleSetDefault(addr)}
                        className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        <Check size={13} />
                        Set Default
                      </button>
                    </>
                  )}
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => handleDelete(addr)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateUpdateAddress
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialValues={selectedItem}
        userId={userId}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />
    </div>
  );
}
