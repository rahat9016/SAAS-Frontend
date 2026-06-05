"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useEffect, useState } from "react";
import BranchesTable from "../BranchesTable";
import CreateBranch from "../Form/CreateBranch";
import { GetBranchColumns } from "../TableColumns/BranchColumns";
import { RbacBranch } from "../types";

export default function BranchList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } = useSearchDebounce(300);

  const { data, isLoading } = useGet<RbacBranch[]>(
    "/api/super-admin/branches",
    ["rbac-branches", currentPage.toString(), itemsPerPage.toString(), debouncedSearch],
    {
      ...(itemsPerPage !== -1 && {
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      }),
      search: debouncedSearch,
    },
  );

  useEffect(() => {
    if (data) setTotalItems(data.meta?.totalItems || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const columns = GetBranchColumns();

  return (
    <div>
      <BranchesTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Branch"
        setIsModalOpen={() => setIsModalOpen(true)}
      />
      <CreateBranch isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
