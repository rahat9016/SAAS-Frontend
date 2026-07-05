"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { useMemo, useState } from "react";
import FilterBar from "../Catalog/FilterBar";
import ProductCard from "../common/ProductCard";
import { toHomeProduct } from "../common/productAdapter";

export default function ShopPage() {
  const allProducts = useMemo(() => dummyProducts.filter((p) => p.isActive), []);

  const categories = useMemo(() => {
    const set = new Map<string, number>();
    allProducts.forEach((p) => set.set(p.category.name, (set.get(p.category.name) ?? 0) + 1));
    return Array.from(set.entries()).map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeCat ? allProducts.filter((p) => p.category.name === activeCat) : allProducts),
    [allProducts, activeCat],
  );

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-4">
      {/* Mobile title */}
      <h1 className="mb-6 text-3xl font-bold text-secondary md:text-4xl lg:hidden">
        {activeCat ?? "All Products"}
      </h1>

      <div className="flex gap-4 lg:gap-6">
        {/* Sidebar — title + subcategory links */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <h1 className="mb-6 text-3xl font-bold text-secondary md:text-4xl">
            {activeCat ?? "All Products"}
          </h1>
          <p className="mb-3 text-sm font-bold text-secondary">Categories</p>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => setActiveCat(null)}
                className={`text-sm font-semibold transition-colors ${
                  activeCat === null ? "text-primary" : "text-secondary hover:text-primary"
                }`}
              >
                All products
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.name}>
                <button
                  onClick={() => setActiveCat(c.name)}
                  className={`text-sm font-semibold transition-colors ${
                    activeCat === c.name ? "text-primary" : "text-secondary hover:text-primary"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <FilterBar />

          <div className="mt-4 grid sm:grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={toHomeProduct(p)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
