"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { ITableProps } from "@/src/types/common/common";
import { ShoppingBag } from "lucide-react";
import { ReactNode } from "react";

interface OrdersTableProps<T> extends ITableProps<T> {
  rightComponents?: ReactNode;
  statusFilterComponent?: ReactNode;
}

const OrdersTable = <T,>({
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
  rightComponents,
  statusFilterComponent,
}: OrdersTableProps<T>) => {
  return (
    <div className="space-y-0">
      {/* Status filter above the table */}
      {statusFilterComponent && (
        <div className="bg-white p-4 rounded-t-lg border border-b-0 border-light-dark">
          {statusFilterComponent}
        </div>
      )}
      <DataTable
        columns={columns}
        data={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        icon={<ShoppingBag />}
        title="Orders"
        showSearch={showSearch}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by order #, customer, payment..."
        IsCreate={false}
        isShowStatus={false}
        rightComponents={rightComponents}
      />
    </div>
  );
};

export default OrdersTable;
