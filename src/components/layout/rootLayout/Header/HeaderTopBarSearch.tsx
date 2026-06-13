"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { IProduct } from "@/src/types/ecommerce/product";
import { Loader2, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface HeaderTopBarSearchProps {
  searchRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  showResults: boolean;
  isSearching: boolean;
  searchResults: IProduct[];
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
  handleProductClick: (slug: string) => void;
  onViewAllResults: () => void;
}

export default function HeaderTopBarSearch({
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
  onViewAllResults,
}: HeaderTopBarSearchProps) {
  return (
    <>
      {/* Mobile Search Bar */}
      <div className="lg:hidden w-full">
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
                    onClick={onViewAllResults}
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
    </>
  );
}
