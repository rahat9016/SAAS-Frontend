"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import GenderTabs from "./GenderTabs";
import HeaderTopBarActions from "./HeaderTopBarActions";
import HeaderTopBarSearch from "./HeaderTopBarSearch";
import LanguageDropdown from "./LanguageDropdown";
import UtilityBar from "./UtilityBar";

interface HeaderTopBarProps {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}

export default function HeaderTopBar({
  menuOpen,
  setMenuOpen,
}: HeaderTopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const { userInformation, loading: authLoading } = useAppSelector(
    (state) => state.auth
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <>
      <UtilityBar />
      <div className="bg-white border-b border-gray-100">
      {/* ═══════ DESKTOP HEADER ═══════ */}
      <div className="hidden lg:block">
        {/* Row: gender tabs · centered logo · actions */}
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center gap-4 h-20">
          <div className="justify-self-start">
            <GenderTabs />
          </div>

          <BrandLogo className="justify-self-center" />

          <div className="justify-self-end">
            <HeaderTopBarActions
              cartCount={cartCount}
              wishlistCount={wishlistIds.length}
              userInformation={userInformation}
              authLoading={authLoading}
            />
          </div>
        </div>

        {/* Centered search row */}
        <div className="container flex justify-center pb-3">
          <HeaderTopBarSearch
            searchRef={searchRef}
            inputRef={inputRef}
            searchQuery={searchQuery}
            showResults={showResults}
            isSearching={isSearching}
            searchResults={searchResults}
            setSearchQuery={setSearchQuery}
            setShowResults={setShowResults}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            handleProductClick={handleProductClick}
            onViewAllResults={handleViewAllResults}
          />
        </div>
      </div>

      {/* ═══════ MOBILE HEADER (AliExpress-style) ═══════ */}
      <div className="lg:hidden">
        {/* Row 1: Hamburger (left) + centered Logo */}
        <div className="relative flex items-center justify-center px-4 h-12">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute left-3 flex items-center justify-center w-8 h-8 text-gray-700 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <BrandLogo size="sm" />

          <div className="absolute right-1">
            <LanguageDropdown />
          </div>
        </div>

        <HeaderTopBarSearch
          searchRef={searchRef}
          inputRef={inputRef}
          searchQuery={searchQuery}
          showResults={showResults}
          isSearching={isSearching}
          searchResults={searchResults}
          setSearchQuery={setSearchQuery}
          setShowResults={setShowResults}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          handleProductClick={handleProductClick}
          onViewAllResults={handleViewAllResults}
        />
      </div>
      </div>
    </>
  );
}
