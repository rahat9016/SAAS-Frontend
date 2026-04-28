"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { Palette } from "lucide-react";
import { AttributesTableProps } from "./types";

const AttributesTable = <T,>({
  columns,
  data,
  isLoading = false,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  setCurrentPage,
  setItemsPerPage,
  search = "",
  showSearch,
  handleSearchChange,
  setIsModalOpen,
  showCreateButton = false,
  createTitle,
  rightComponents,
  title = "Product Attributes",
  searchPlaceholder = "Searching...",
  isShowStatus = true,
  tabs,
}: AttributesTableProps<T>) => {
  return (
    <DataTable
      columns={columns}
      data={Array.isArray(data) ? data : []}
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      setItemsPerPage={setItemsPerPage}
      icon={<Palette />}
      title={title}
      showSearch={showSearch}
      searchValue={search}
      onSearchChange={handleSearchChange}
      createTitle={createTitle}
      IsCreate={showCreateButton}
      setIsModalOpen={setIsModalOpen}
      rightComponents={rightComponents}
      searchPlaceholder={searchPlaceholder}
      isShowStatus={isShowStatus}
      tabs={tabs}
    />
  );
};

export default AttributesTable;
