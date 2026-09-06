"use client";

import { useMemo, useState } from "react";

/**
 * Client side paging for the Material tables — the taxonomy lives in memory,
 * so DataTable's pagination bar is driven off a local slice.
 */
export function useClientPagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setPerPage] = useState(10);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  // Rows can disappear under the current page (search, delete) — clamp instead
  // of showing an empty table.
  const safePage = Math.min(currentPage, totalPages);

  const pagedItems = useMemo(
    () => items.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage),
    [items, safePage, itemsPerPage]
  );

  const setItemsPerPage = (value: string | number) => {
    setPerPage(Number(value) || 10);
    setCurrentPage(1);
  };

  return {
    pagedItems,
    totalItems,
    currentPage: safePage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    resetPage: () => setCurrentPage(1),
  };
}
