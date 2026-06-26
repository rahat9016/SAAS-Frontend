"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { IProduct } from "@/src/types/ecommerce/product";
import { Loader2, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface NavSearchProps {
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

/** Desktop search living inside the category nav bar — expands full-width on focus. */
export default function NavSearch({
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
}: NavSearchProps) {
  return (
    <div ref={searchRef} className="relative w-64 shrink-0 xl:w-86">
      <form onSubmit={handleSearch} className="flex w-full">
        <div className="relative flex w-full">
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors"
            aria-label="Search"
          >
            {isSearching ? (
              <Loader2 size={18} className="animate-spin text-green-600" />
            ) : (
              <Search size={18} />
            )}
          </button>
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
            className="w-full h-11 pl-10 pr-10 rounded-full border border-gray-300 bg-white text-sm focus:border-green-600 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {showResults && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-100 max-h-120 overflow-y-auto">
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
                onClick={onViewAllResults}
                className="w-full px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 border-t border-gray-100 transition-colors"
              >
                View all results for &quot;{searchQuery}&quot; →
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              <p>No products found for &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
