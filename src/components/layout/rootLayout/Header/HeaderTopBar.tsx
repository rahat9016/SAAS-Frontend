"use client";

import logo from "@/public/logo.png";
import { siteConfig } from "@/src/config/siteConfig";
import { dummyProducts } from "@/src/data/dummyProducts";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderTopBarActions from "./HeaderTopBarActions";
import HeaderTopBarSearch from "./HeaderTopBarSearch";

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
    <div className="bg-white border-b border-gray-100">
      {/* ═══════ DESKTOP HEADER ═══════ */}
      <div className="hidden lg:flex container items-center justify-between gap-8 h-18">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Image
            src={logo}
            alt={siteConfig.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

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

        <HeaderTopBarActions
          cartCount={cartCount}
          wishlistCount={wishlistIds.length}
          userInformation={userInformation}
          authLoading={authLoading}
        />
      </div>

      {/* ═══════ MOBILE HEADER (AliExpress-style) ═══════ */}
      <div className="lg:hidden">
        {/* Row 1: Hamburger + Logo + Deliver to */}
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-primary transition-colors -ml-1"
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
            <Link href="/" className="flex items-center gap-1.5">
              <Image
                src={logo}
                alt={siteConfig.name}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                {siteConfig.name}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            <span>
              Deliver to <strong className="text-gray-700">Bangladesh</strong>
            </span>
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
  );
}
