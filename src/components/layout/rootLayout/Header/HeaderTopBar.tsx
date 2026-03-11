"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { dummyProducts } from "@/src/data/dummyProducts";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  Camera,
  Heart,
  Loader2,
  MapPin,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);
  const { userInformation } = useAppSelector((state) => state.auth);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
    setIsSearching(false);
  }, [searchQuery]);

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

  return (
    <div className="bg-white border-b border-gray-100">
      {/* ═══════ DESKTOP HEADER ═══════ */}
      <div className="hidden lg:flex container items-center justify-between gap-8 h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold text-gray-900 tracking-tight"
        >
          {siteConfig.name}
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex w-full">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (searchQuery.length >= 2) setShowResults(true);
                }}
                placeholder="Search for products, brands, and more..."
                className="w-full h-11 pl-4 pr-20 rounded-l-full border-2 border-r-0 border-gray-200 bg-gray-50 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-[88px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                className="flex items-center justify-center w-11 h-11 border-2 border-l-0 border-r-0 border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={isSearching ? "Searching" : "Search by image"}
              >
                {isSearching ? (
                  <Loader2 size={18} className="animate-spin text-primary" />
                ) : (
                  <Camera size={18} />
                )}
              </button>
              <button
                type="submit"
                className="flex items-center justify-center w-12 h-11 rounded-r-full bg-primary text-white hover:bg-primary/90 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Desktop Search Results Dropdown */}
          {showResults && searchQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-100 max-h-[480px] overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-8 gap-2 text-sm text-gray-500">
                  <Loader2 size={18} className="animate-spin" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    Products ({searchResults.length})
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingCart size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-primary">
                            {siteConfig.currencySymbol}
                            {product.price.toLocaleString()}
                          </span>
                          {product.compareAtPrice &&
                            product.compareAtPrice > product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {siteConfig.currencySymbol}
                                {product.compareAtPrice.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowResults(false);
                      router.push(
                        `/search?q=${encodeURIComponent(searchQuery.trim())}`
                      );
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 border-t border-gray-100 transition-colors"
                  >
                    View all results for &quot;{searchQuery}&quot; →
                  </button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                  <p>No products found for &quot;{searchQuery}&quot;</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different keyword
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Right Actions */}
        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">
              {siteConfig.currency}
            </span>
          </div>
          <Link
            href={userInformation?.firstName ? "/account" : "/auth/login"}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
          >
            <User
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xs whitespace-nowrap">
              {userInformation?.firstName
                ? userInformation.firstName
                : "Sign in"}
            </span>
          </Link>
          <Link
            href="/wishlist"
            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
          >
            <Heart
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xs">Wishlist</span>
            {wishlistIds.length > 0 && (
              <span className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                {wishlistIds.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-600 hover:text-primary transition-colors group"
          >
            <ShoppingCart
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 tracking-tight"
            >
              {siteConfig.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            <span>Deliver to <strong className="text-gray-700">Bangladesh</strong></span>
          </div>
        </div>

        {/* Row 2: Full-width search bar */}
        <div className="px-4 pb-3 relative" ref={searchRef}>
          <form onSubmit={handleSearch}>
            <div className="relative flex w-full">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => {
                  if (searchQuery.length >= 2) setShowResults(true);
                }}
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-12 rounded-full border-2 border-gray-800 bg-white text-sm focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Mobile Search Results */}
          {showResults && searchQuery.length >= 2 && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-100 max-h-[60vh] overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-6 gap-2 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingCart size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">
                          {product.name}
                        </p>
                        <span className="text-xs font-semibold text-primary">
                          {siteConfig.currencySymbol}
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setShowResults(false);
                      router.push(
                        `/search?q=${encodeURIComponent(searchQuery.trim())}`
                      );
                    }}
                    className="w-full px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 border-t border-gray-100"
                  >
                    View all results →
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
