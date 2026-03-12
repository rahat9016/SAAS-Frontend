"use client";

import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useDelete } from "@/src/hooks/useDelete";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { GetSubCategoryColumns } from "../TableColumns/SubCategoryColumns";
import { ISubCategory } from "../types";
import CreateUpdateSubCategory from "../Form/CreateUpdateSubCategory";

export default function SubCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ISubCategory | undefined
  >();

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

  const { data, isLoading } = useGet<ISubCategory[]>(
    "/sub-categories",
    [
      "sub-categories",
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

  const { mutate: deleteMutate } = useDelete(
    () => {
      toast.success("Sub category deleted successfully!");
    },
    [["sub-categories"]]
  );

  useEffect(() => {
    if (data) {
      setTotalItems(data.meta?.totalItems || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleEdit = (item: ISubCategory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sub category?")) {
      deleteMutate({ url: `/sub-categories/${id}` });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const columns = GetSubCategoryColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
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
        showCreateButton
        createTitle="Create Sub Category"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateSubCategory
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialValues={selectedItem}
      />
    </div>
  );
}
