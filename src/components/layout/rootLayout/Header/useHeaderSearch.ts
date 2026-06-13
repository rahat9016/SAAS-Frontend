"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/** Shared product-search state for the header (desktop nav bar + mobile bar). */
export function useHeaderSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Derive isSearching from query mismatch — no setState in effect needed
  const isSearching = searchQuery.length >= 2 && searchQuery !== debouncedQuery;

  const searchResults = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return dummyProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (slug: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(`/products/${slug}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleViewAllResults = () => {
    setShowResults(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return {
    searchRef,
    inputRef,
    searchQuery,
    showResults,
    isSearching,
    searchResults,
    setSearchQuery,
    setShowResults,
    handleSearch,
    clearSearch,
    handleProductClick,
    handleViewAllResults,
  };
}
