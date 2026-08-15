"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { ITableProps } from "@/src/types/common/common";
import { Palette } from "lucide-react";

const ProductAttributesTable = <T,>({
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
}: ITableProps<T>) => {
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
      title="Product Attributes"
      showSearch={showSearch}
      searchValue={search}
      onSearchChange={handleSearchChange}
      createTitle={createTitle}
      tabs={[
        { name: "Color Chart", route: "/admin/color-chart" },
        { name: "Size Chart", route: "/admin/size-chart" },
      ]}
      IsCreate={showCreateButton}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default ProductAttributesTable;
