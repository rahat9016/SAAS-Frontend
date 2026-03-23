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
import styles from "./ShopPage.module.css";

export default function ShopPage() {
  const allProducts = dummyProducts.filter((p) => p.isActive);

  // Derive filter options from data
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

  // State
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

  // Filter
  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category.name));
    }
    if (filters.brands.length > 0) {
      result = result.filter((p) => p.brand && filters.brands.includes(p.brand.name));
    }
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
      result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    }
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        const productColors = new Set<string>();
        p.attributes?.forEach((attr) => {
          if (attr.name === "Color") productColors.add(attr.value);
        });
        p.variants?.forEach((v) => {
          v.attributes?.forEach((attr) => {
            if (attr.name === "Color") productColors.add(attr.value);
          });
        });
        return filters.colors.some((c) => productColors.has(c));
      });
    }
    if (filters.freeShipping) {
      result = result.filter((p) => p.freeShipping);
    }
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
      default:
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
    }

    return result;
  }, [allProducts, filters, sort, priceRange]);

  // Active filter tags
  const activeFilterTags = useMemo(() => {
    const tags: { label: string; clear: () => void }[] = [];
    filters.categories.forEach((c) =>
      tags.push({
        label: c,
        clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
      })
    );
    filters.brands.forEach((b) =>
      tags.push({
        label: b,
        clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })),
      })
    );
    filters.colors.forEach((c) =>
      tags.push({
        label: c,
        clear: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
      })
    );
    if (filters.minRating > 0) {
      tags.push({
        label: `${filters.minRating}★ & up`,
        clear: () => setFilters((f) => ({ ...f, minRating: 0 })),
      });
    }
    if (filters.freeShipping) {
      tags.push({
        label: "Free Shipping",
        clear: () => setFilters((f) => ({ ...f, freeShipping: false })),
      });
    }
    if (filters.inStock) {
      tags.push({
        label: "In Stock",
        clear: () => setFilters((f) => ({ ...f, inStock: false })),
      });
    }
    if (filters.minPrice > priceRange.min || filters.maxPrice < priceRange.max) {
      tags.push({
        label: `৳${filters.minPrice.toLocaleString()} – ৳${filters.maxPrice.toLocaleString()}`,
        clear: () => setFilters((f) => ({ ...f, minPrice: priceRange.min, maxPrice: priceRange.max })),
      });
    }
    return tags;
  }, [filters, priceRange]);

  const clearAllFilters = () =>
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      freeShipping: false,
      inStock: false,
    });

  const toggleCategory = (name: string) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(name) ? f.categories.filter((x) => x !== name) : [...f.categories, name],
    }));

  const toggleBrand = (name: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(name) ? f.brands.filter((x) => x !== name) : [...f.brands, name],
    }));

  const toggleColor = (color: string) =>
    setFilters((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((x) => x !== color) : [...f.colors, color],
    }));

  // --- Render filter content (reuse in sidebar & mobile drawer) ---
  const renderFilters = () => (
    <>
      {/* Price Range */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>Price Range</h4>
        <div className={styles.priceRange}>
          <div className={styles.priceInputs}>
            <input
              type="number"
              className={styles.priceInput}
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: Math.max(priceRange.min, Number(e.target.value)) }))}
              min={priceRange.min}
              max={filters.maxPrice}
            />
            <span className={styles.priceSeparator}>–</span>
            <input
              type="number"
              className={styles.priceInput}
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Math.min(priceRange.max, Number(e.target.value)) }))}
              min={filters.minPrice}
              max={priceRange.max}
            />
          </div>
          <div className={styles.rangeSlider}>
            <div
              className={styles.rangeTrack}
              style={{
                left: `${((filters.minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                right: `${100 - ((filters.maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: Math.min(Number(e.target.value), f.maxPrice - 50) }))}
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Math.max(Number(e.target.value), f.minPrice + 50) }))}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>Category</h4>
        <div className={styles.checkList}>
          {allCategories.map((cat) => (
            <label key={cat.name} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
              />
              <span>{cat.name}</span>
              <span className={styles.checkCount}>({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>Brand</h4>
        <div className={styles.checkList}>
          {allBrands.map((brand) => (
            <label key={brand.name} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
              />
              <span>{brand.name}</span>
              <span className={styles.checkCount}>({brand.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>Color</h4>
        <div className={styles.colorSwatchGrid}>
          {allColors.map((color) => {
            const isActive = filters.colors.includes(color);
            const hex = COLOR_HEX[color] || "#cccccc";
            const isLight = ["White", "Cream", "Light Wash"].includes(color);
            return (
              <button
                key={color}
                title={color}
                className={`${styles.colorSwatch} ${isActive ? styles.colorSwatchActive : ""}`}
                onClick={() => toggleColor(color)}
              >
                <span className={styles.colorSwatchInner} style={{ background: hex }} />
                {isActive && (
                  <Check
                    size={12}
                    strokeWidth={3}
                    className={styles.colorSwatchCheck}
                    style={{ color: isLight ? "#333" : "#fff" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>Rating</h4>
        <div className={styles.ratingList}>
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              className={`${styles.ratingItem} ${filters.minRating === r ? styles.ratingItemActive : ""}`}
              onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
            >
              <div className={styles.ratingStars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < r ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span className={styles.ratingText}>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterGroupTitle}>More Filters</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className={styles.toggleItem}>
            <span className={styles.toggleLabel}>Free Shipping</span>
            <button
              className={`${styles.toggleSwitch} ${filters.freeShipping ? styles.toggleSwitchActive : ""}`}
              onClick={() => setFilters((f) => ({ ...f, freeShipping: !f.freeShipping }))}
            >
              <span className={styles.toggleDot} />
            </button>
          </div>
          <div className={styles.toggleItem}>
            <span className={styles.toggleLabel}>In Stock Only</span>
            <button
              className={`${styles.toggleSwitch} ${filters.inStock ? styles.toggleSwitchActive : ""}`}
              onClick={() => setFilters((f) => ({ ...f, inStock: !f.inStock }))}
            >
              <span className={styles.toggleDot} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container">
      <div className={styles.page}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>All Products</h1>
          <p className={styles.pageSubtitle}>
            Browse our complete collection of {allProducts.length} products
          </p>
        </div>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            <span className={styles.resultCount}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <select
            className={styles.sortSelect}
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
          <div className={styles.activeFilters}>
            {activeFilterTags.map((tag, i) => (
              <button key={i} className={styles.activeTag} onClick={tag.clear}>
                {tag.label}
                <X size={12} />
              </button>
            ))}
            <button className={styles.clearAllBtn} onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Grid */}
        <div className={styles.layout}>
          {/* Desktop Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>
                <Filter size={16} />
                Filters
              </span>
              {activeFilterTags.length > 0 && (
                <button className={styles.sidebarResetBtn} onClick={clearAllFilters}>
                  Reset All
                </button>
              )}
            </div>
            {renderFilters()}
          </aside>

          {/* Products Grid */}
          <div className={styles.productsGrid}>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Package size={28} />
                </div>
                <h3 className={styles.emptyTitle}>No products found</h3>
                <p className={styles.emptyText}>
                  Try adjusting your filters to find what you&apos;re looking for.
                </p>
                <button className={styles.clearAllBtn} onClick={clearAllFilters}>
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
          <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)}>
            <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.mobileDrawerHeader}>
                <span className={styles.sidebarTitle}>
                  <Filter size={16} />
                  Filters
                </span>
                <button className={styles.mobileDrawerClose} onClick={() => setMobileOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className={styles.mobileDrawerBody}>{renderFilters()}</div>
              <div className={styles.mobileDrawerFooter}>
                <button className={styles.applyBtn} onClick={() => setMobileOpen(false)}>
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
