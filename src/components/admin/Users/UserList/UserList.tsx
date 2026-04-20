"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateUpdateUser from "../Form/CreateUpdateUser";
import { GetUserColumns } from "../TableColumns/UserColumns";
import { IUser } from "../types";
import UsersTable from "../UsersTable";
import ViewUserInfoModal from "../ViewUserInfoModal";

type TStatusAction = "activate" | "deactivate" | null;

export default function UserList() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IUser | undefined>();
  const [statusAction, setStatusAction] = useState<TStatusAction>(null);

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

  const { data, isLoading } = useGet<IUser[]>(
    "/user",
    [
      "users",
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

  const { mutate: toggleStatusMutate } = usePatch(() => {
    toast.success(
      statusAction === "activate"
        ? "User activated successfully!"
        : "User deactivated successfully!"
    );
    setIsStatusConfirmOpen(false);
    setStatusAction(null);
    setSelectedItem(undefined);
  }, [["users"]]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: IUser) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleView = (item: IUser) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleActivate = (item: IUser) => {
    setSelectedItem(item);
    setStatusAction("activate");
    setIsStatusConfirmOpen(true);
  };

  const handleDeactivate = (item: IUser) => {
    setSelectedItem(item);
    setStatusAction("deactivate");
    setIsStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!selectedItem || !statusAction) return;

    toggleStatusMutate({
      url: `/user/${selectedItem.id}`,
      data: {
        status: statusAction === "activate" ? "ACTIVE" : "INACTIVE",
      },
    });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleStatusConfirmClose = () => {
    setIsStatusConfirmOpen(false);
    setStatusAction(null);
    setSelectedItem(undefined);
  };

  const columns = GetUserColumns(
    handleView,
    handleEdit,
    handleActivate,
    handleDeactivate
  );

  return (
    <div>
      <UsersTable
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
      />

      <CreateUpdateUser
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        initialValues={selectedItem}
      />

      <ViewUserInfoModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        user={selectedItem}
      />

      <DeleteConfirmDialog
        isOpen={isStatusConfirmOpen}
        onClose={handleStatusConfirmClose}
        onConfirm={handleConfirmStatusChange}
        title={
          statusAction === "activate" ? "Activate User" : "Deactivate User"
        }
        description={`Are you sure you want to ${statusAction === "activate" ? "activate" : "deactivate"} this user?`}
        confirmLabel={statusAction === "activate" ? "Activate" : "Deactivate"}
        confirmClassName={
          statusAction === "activate"
            ? "bg-primary hover:bg-primary/90 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }
      />
    </div>
  );
}
