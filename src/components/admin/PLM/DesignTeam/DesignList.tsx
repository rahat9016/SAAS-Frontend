"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/src/lib/redux/hooks";
import { deleteDesign } from "@/src/lib/redux/features/plm/plmSlice";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import DesignTable from "./DesignTable";
import { GetDesignColumns } from "./TableColumns/DesignColumns";
import { IDesignListItem, ProductStatus } from "@/src/types/plm/productLifecycleTypes";
import RoleSwitcher from "../shared/RoleSwitcher";
import BranchSelector from "../shared/BranchSelector";
import { hasPermission, isBranchScoped } from "@/src/types/plm/plmPermissions";

export default function DesignList() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const designs = useAppSelector((state) => state.plm.designs);
  const userProfile = useAppSelector((state) => state.plm.userProfile);
  const selectedBranchId = useAppSelector((state) => state.plm.selectedBranchId);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // RBAC: permission-based capabilities
  const canDelete = hasPermission(userProfile.roles, "plm.design.create"); // only creators can delete
  const canCreate = hasPermission(userProfile.roles, "plm.design.create");

  // Map to list items with ABAC filtering
  const designListItems: IDesignListItem[] = useMemo(() => {
    let filtered = designs;

    // ABAC: Branch-scoped users only see their branch
    if (isBranchScoped(userProfile.roles) && userProfile.branchId) {
      filtered = filtered.filter((d) => d.branchId === userProfile.branchId);
    } else if (selectedBranchId) {
      // Super Admin can filter by branch via selector
      filtered = filtered.filter((d) => d.branchId === selectedBranchId);
    }

    // ABAC: Design Team only sees their own designs
    if (
      userProfile.roles.includes("DESIGN_TEAM") &&
      !userProfile.roles.includes("BRANCH_MODERATOR") &&
      !userProfile.roles.includes("SUPER_ADMIN")
    ) {
      filtered = filtered.filter((d) => d.designerId === userProfile.id);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    return filtered.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      designerName: d.designerName,
      branchName: d.branchName,
      status: d.status,
      createdAt: d.createdAt,
    }));
  }, [designs, userProfile, selectedBranchId, statusFilter]);

  const handleView = (id: string) => {
    router.push(`/admin/plm/designs/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteDesign(deleteId));
      toast.success("Design deleted successfully!");
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
        data={designListItems}
        isLoading={false}
        totalItems={designListItems.length}
        currentPage={1}
        itemsPerPage={10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search=""
        handleSearchChange={() => {}}
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
