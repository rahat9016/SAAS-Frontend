"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import ProductsTable from "../ProductsTable";
import { GetProductColumns } from "../TableColumns/ProductColumns";
import { MOCK_PRODUCTS } from "../data/mockProducts";
import { IProductListItem } from "../types";

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<IProductListItem[]>(MOCK_PRODUCTS);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        data={products}
        isLoading={false}
        totalItems={products.length}
        currentPage={1}
        itemsPerPage={10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search=""
        handleSearchChange={() => {}}
        showCreateButton
        createTitle="Create Product"
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
