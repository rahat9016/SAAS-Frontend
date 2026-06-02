"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useGet } from "@/src/hooks/useGet";
import { useDelete } from "@/src/hooks/useDelete";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import DesignTable from "./DesignTable";
import { GetDesignColumns } from "./TableColumns/DesignColumns";
import { IDesignListItem, ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import RoleSwitcher from "../shared/RoleSwitcher";
import BranchSelector from "../shared/BranchSelector";
import { isBranchScoped } from "@/src/types/plm/plmPermissions";

export default function DesignList() {
  const router = useRouter();
  const userProfile = useAppSelector((state) => state.plm.userProfile);
  const selectedBranchId = useAppSelector((state) => state.plm.selectedBranchId);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } = useSearchDebounce(300);

  // RBAC: permission-based capabilities
  const canDelete = userProfile.permissions.includes("plm.design.create");
  const canCreate = userProfile.permissions.includes("plm.design.create");

  // Query designs from Next.js backend API
  const { data, isLoading } = useGet<any>(
    "/api/plm/design",
    [
      "designs",
      currentPage.toString(),
      itemsPerPage.toString(),
      debouncedSearch,
      statusFilter,
      selectedBranchId || "all",
      userProfile.roles.join(","),
    ],
    {
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      search: debouncedSearch,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(selectedBranchId && { branchId: selectedBranchId }),
    }
  );

  const { mutate: deleteMutate } = useDelete(() => {
    toast.success("Design deleted successfully!");
  }, [["designs"]]);

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
  }, [data, setTotalItems]);

  const handleView = (id: string) => {
    router.push(`/admin/plm/designs/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutate({ url: `/api/plm/design/${deleteId}` });
      setDeleteId(null);
    }
  };

  const columns = GetDesignColumns(
    handleView,
    canDelete ? handleDelete : undefined
  );

  const statusOptions: ProductStatus[] = [
    ProductStatus.CONCEPT,
    ProductStatus.DESIGN_IN_PROGRESS,
    ProductStatus.DESIGN_SUBMITTED,
    ProductStatus.MODERATOR_REVIEW,
    ProductStatus.MODERATOR_APPROVED,
    ProductStatus.SUPER_ADMIN_REVIEW,
    ProductStatus.SUPER_ADMIN_APPROVED,
    ProductStatus.SUPER_ADMIN_REJECTED,
    ProductStatus.IN_PRODUCTION,
    ProductStatus.LIVE_FOR_SALE,
  ];

  return (
    <div>
      {/* Header with role switcher and branch filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="w-full sm:w-64">
          <RoleSwitcher />
        </div>
        {/* Only show branch selector if user is not branch-scoped */}
        {!isBranchScoped(userProfile.roles) && <BranchSelector />}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <DesignTable
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
        showCreateButton={canCreate}
        createTitle="Create Design"
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Design"
        description="Are you sure you want to delete this design? This action cannot be undone."
      />
    </div>
  );
}
