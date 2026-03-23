"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { IProduct } from "@/src/types/ecommerce/product";
import { IShopFilters, SortOption } from "@/src/types/ecommerce/shop";
import { SORT_OPTIONS } from "@/src/constants/ecommerce/shop";
import {
  Check,
  Filter,
  Package,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";

// Color name → hex mapping for swatches
const COLOR_HEX: Record<string, string> = {
  "Black": "#111111",
  "White": "#f9f9f9",
  "Indigo": "#3f51b5",
  "Light Wash": "#a8c4e0",
  "Rose Pink": "#e8919a",
  "Sky Blue": "#87ceeb",
  "Charcoal": "#444444",
  "Cream": "#f5f0e1",
  "Forest Green": "#2d6a2e",
  "Grey Marl": "#b0b0b0",
  "Khaki": "#c3b091",
  "Navy": "#1b2b5e",
  "Olive": "#6b7a3f",
  "Dusty Pink": "#d4a5a5",
};
import { useMemo, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";

export default function ShopPage() {
  const allProducts = dummyProducts.filter((p) => p.isActive);

  const allCategories = useMemo(() => {
    const cats = new Map<string, number>();
    allProducts.forEach((p) => {
      cats.set(p.category.name, (cats.get(p.category.name) ?? 0) + 1);
    });
    return Array.from(cats.entries()).map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  const allBrands = useMemo(() => {
    const brands = new Map<string, number>();
    allProducts.forEach((p) => {
      if (p.brand) brands.set(p.brand.name, (brands.get(p.brand.name) ?? 0) + 1);
    });
    return Array.from(brands.entries()).map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  const allColors = useMemo(() => {
    const colorSet = new Set<string>();
    allProducts.forEach((p) => {
      p.attributes?.forEach((attr) => {
        if (attr.name === "Color") colorSet.add(attr.value);
      });
      p.variants?.forEach((v) => {
        v.attributes?.forEach((attr) => {
          if (attr.name === "Color") colorSet.add(attr.value);
        });
      });
    });
    return Array.from(colorSet).sort();
  }, [allProducts]);

  const priceRange = useMemo(() => {
    const prices = allProducts.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [allProducts]);

  const [sort, setSort] = useState<SortOption>("popularity");
  const [filters, setFilters] = useState<IShopFilters>({
    categories: [],
    brands: [],
    colors: [],
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    minRating: 0,
    freeShipping: false,
    inStock: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (filters.categories.length > 0) result = result.filter((p) => filters.categories.includes(p.category.name));
    if (filters.brands.length > 0) result = result.filter((p) => p.brand && filters.brands.includes(p.brand.name));
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
      result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    }
    if (filters.minRating > 0) result = result.filter((p) => p.rating >= filters.minRating);
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        const productColors = new Set<string>();
        p.attributes?.forEach((attr) => { if (attr.name === "Color") productColors.add(attr.value); });
        p.variants?.forEach((v) => { v.attributes?.forEach((attr) => { if (attr.name === "Color") productColors.add(attr.value); }); });
        return filters.colors.some((c) => productColors.has(c));
      });
    }
    if (filters.freeShipping) result = result.filter((p) => p.freeShipping);
    if (filters.inStock) result = result.filter((p) => p.stock > 0);

    switch (sort) {
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popularity": default: result.sort((a, b) => b.totalReviews - a.totalReviews);
    }
    return result;
  }, [allProducts, filters, sort, priceRange]);

  const activeFilterTags = useMemo(() => {
    const tags: { label: string; clear: () => void }[] = [];
    filters.categories.forEach((c) => tags.push({ label: c, clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })) }));
    filters.brands.forEach((b) => tags.push({ label: b, clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })) }));
    filters.colors.forEach((c) => tags.push({ label: c, clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })) }));
    if (filters.minRating > 0) tags.push({ label: `${filters.minRating}★ & up`, clear: () => setFilters((f) => ({ ...f, minRating: 0 })) });
    if (filters.freeShipping) tags.push({ label: "Free Shipping", clear: () => setFilters((f) => ({ ...f, freeShipping: false })) });
    if (filters.inStock) tags.push({ label: "In Stock", clear: () => setFilters((f) => ({ ...f, inStock: false })) });
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
      tags.push({ label: `৳${filters.minPrice.toLocaleString()} – ৳${filters.maxPrice.toLocaleString()}`, clear: () => setFilters((f) => ({ ...f, minPrice: priceRange.min, maxPrice: priceRange.max })) });
    }
    return tags;
  }, [filters, priceRange]);

  const clearAllFilters = () => setFilters({ categories: [], brands: [], colors: [], minPrice: priceRange.min, maxPrice: priceRange.max, minRating: 0, freeShipping: false, inStock: false });
  const toggleCategory = (name: string) => setFilters((f) => ({ ...f, categories: f.categories.includes(name) ? f.categories.filter((x) => x !== name) : [...f.categories, name] }));
  const toggleBrand = (name: string) => setFilters((f) => ({ ...f, brands: f.brands.includes(name) ? f.brands.filter((x) => x !== name) : [...f.brands, name] }));
  const toggleColor = (color: string) => setFilters((f) => ({ ...f, colors: f.colors.includes(color) ? f.colors.filter((x) => x !== color) : [...f.colors, color] }));

  const renderFilters = () => (
    <>
      {/* Price Range */}
      <div className="px-4 py-3.5 border-b border-border last:border-b-0">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Price Range</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="flex-1 px-2.5 py-1.5 border border-border rounded text-sm bg-background text-foreground text-center outline-none focus:border-primary"
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: Math.max(priceRange.min, Number(e.target.value)) }))}
              min={priceRange.min}
              max={filters.maxPrice}
            />
            <span className="text-sm text-muted-foreground font-medium">–</span>
            <input
              type="number"
              className="flex-1 px-2.5 py-1.5 border border-border rounded text-sm bg-background text-foreground text-center outline-none focus:border-primary"
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Math.min(priceRange.max, Number(e.target.value)) }))}
              min={filters.minPrice}
              max={priceRange.max}
            />
          </div>
          <div className="range-slider relative w-full h-1.5 rounded-sm bg-border">
            <div
              className="absolute h-full bg-primary rounded-sm"
              style={{
                left: `${((filters.minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                right: `${100 - ((filters.maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
              }}
            />
            <input type="range" className="range-input" min={priceRange.min} max={priceRange.max} value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: Math.min(Number(e.target.value), f.maxPrice - 50) }))} />
            <input type="range" className="range-input" min={priceRange.min} max={priceRange.max} value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Math.max(Number(e.target.value), f.minPrice + 50) }))} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3.5 border-b border-border last:border-b-0">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Category</h4>
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
          {allCategories.map((cat) => (
            <label key={cat.name} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer shrink-0" checked={filters.categories.includes(cat.name)} onChange={() => toggleCategory(cat.name)} />
              <span>{cat.name}</span>
              <span className="text-[11px] text-muted-foreground ml-auto">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="px-4 py-3.5 border-b border-border last:border-b-0">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Brand</h4>
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
          {allBrands.map((brand) => (
            <label key={brand.name} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input type="checkbox" className="w-4 h-4 accent-primary cursor-pointer shrink-0" checked={filters.brands.includes(brand.name)} onChange={() => toggleBrand(brand.name)} />
              <span>{brand.name}</span>
              <span className="text-[11px] text-muted-foreground ml-auto">({brand.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="px-4 py-3.5 border-b border-border last:border-b-0">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Color</h4>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const isActive = filters.colors.includes(color);
            const hex = COLOR_HEX[color] || "#cccccc";
            const isLight = ["White", "Cream", "Light Wash"].includes(color);
            return (
              <button
                key={color}
                title={color}
                className={`relative w-7 h-7 rounded-full border-2 cursor-pointer p-0 bg-transparent transition-all hover:scale-110 ${isActive ? "border-primary shadow-[0_0_0_2px] shadow-primary" : "border-border"}`}
                onClick={() => toggleColor(color)}
              >
                <span className="w-full h-full rounded-full block" style={{ background: hex }} />
                {isActive && (
                  <Check size={12} strokeWidth={3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ color: isLight ? "#333" : "#fff" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="px-4 py-3.5 border-b border-border last:border-b-0">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Rating</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              className={`flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded transition-all text-sm text-foreground border border-transparent bg-transparent hover:bg-muted ${filters.minRating === r ? "bg-primary/10 border-primary/20" : ""}`}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={13} className={i < r ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="px-4 py-3.5">
        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">More Filters</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-foreground">Free Shipping</span>
            <button
              className={`relative w-10 h-5.5 rounded-full border-none cursor-pointer p-0 transition-colors ${filters.freeShipping ? "bg-primary" : "bg-border"}`}
              onClick={() => setFilters((f) => ({ ...f, freeShipping: !f.freeShipping }))}
            >
              <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${filters.freeShipping ? "translate-x-[1.1rem]" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-foreground">In Stock Only</span>
            <button
              className={`relative w-10 h-5.5 rounded-full border-none cursor-pointer p-0 transition-colors ${filters.inStock ? "bg-primary" : "bg-border"}`}
              onClick={() => setFilters((f) => ({ ...f, inStock: !f.inStock }))}
            >
              <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${filters.inStock ? "translate-x-[1.1rem]" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container px-4 sm:px-6 lg:px-8">
      <div className="py-6 pb-16 lg:pb-16">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">All Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our complete collection of {allProducts.length} products
          </p>
        </div>

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm font-semibold cursor-pointer hover:border-primary hover:text-primary transition-all lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            <span className="text-sm text-muted-foreground">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <select
            className="px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm cursor-pointer outline-none focus:border-primary"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort by: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        {activeFilterTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {activeFilterTags.map((tag, i) => (
              <button key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold border-none cursor-pointer hover:opacity-85 transition-opacity" onClick={tag.clear}>
                {tag.label}
                <X size={12} />
              </button>
            ))}
            <button className="text-[11px] font-semibold text-red-500 bg-transparent border-none cursor-pointer px-2 py-1 underline" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col border border-border rounded-xl bg-card overflow-hidden h-fit sticky top-28">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <Filter size={16} />
                Filters
              </span>
              {activeFilterTags.length > 0 && (
                <button className="text-[11px] text-red-500 bg-transparent border-none cursor-pointer font-semibold" onClick={clearAllFilters}>
                  Reset All
                </button>
              )}
            </div>
            {renderFilters()}
          </aside>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Package size={28} />
                </div>
                <h3 className="text-lg font-bold text-foreground">No products found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters to find what you&apos;re looking for.
                </p>
                <button className="text-[11px] font-semibold text-red-500 bg-transparent border-none cursor-pointer underline" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              filtered.map((product: IProduct) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="w-80 max-w-[85vw] h-full bg-card overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Filter size={16} />
                  Filters
                </span>
                <button className="flex items-center justify-center w-8 h-8 rounded border border-border bg-transparent text-foreground cursor-pointer" onClick={() => setMobileOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{renderFilters()}</div>
              <div className="px-5 py-4 border-t border-border">
                <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity border-none" onClick={() => setMobileOpen(false)}>
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
