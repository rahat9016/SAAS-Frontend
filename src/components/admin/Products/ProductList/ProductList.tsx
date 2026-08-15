"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import ProductsTable from "../ProductsTable";
import { GetProductColumns } from "../TableColumns/ProductColumns";

import { IProductListItem } from "../types";
import { MOCK_PRODUCTS } from "../data/mockProducts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<IProductListItem[]>(MOCK_PRODUCTS);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const dateFilterOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.createdAt))).sort().reverse(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((item) => {
      const matchesSearch =
        !q ||
        [item.name, item.category].join(" ").toLowerCase().includes(q);
      const matchesStatus =
        !sortBy || (sortBy === "ACTIVE" ? item.status : !item.status);
      const matchesDate = dateFilter === "all" || item.createdAt === dateFilter;
      const matchesMonth = monthFilter === "all" || item.month === monthFilter;
      return matchesSearch && matchesStatus && matchesDate && matchesMonth;
    });
  }, [products, search, sortBy, dateFilter, monthFilter]);

  const handleView = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Product deleted successfully!");
      setDeleteId(null);
    }
  };

  const columns = GetProductColumns(handleView, handleDelete);

  return (
    <div>
      <ProductsTable
        columns={columns}
        data={filteredProducts}
        isLoading={false}
        totalItems={filteredProducts.length}
        currentPage={1}
        itemsPerPage={filteredProducts.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Product"
        isShowStatus
        rightComponents={
          <div className="flex items-center gap-3">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="h-11 px-3 text-sm border border-light-dark rounded-[6px] bg-white text-secondary-dark"
            >
              <option value="all">All Months</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-11 px-3 text-sm border border-light-dark rounded-[6px] bg-white text-secondary-dark"
            >
              <option value="all">All Dates</option>
              {dateFilterOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        }
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
