"use client";

import { dummyProducts } from "@/src/data/dummyProducts";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import FilterBar from "../Catalog/FilterBar";
import ProductCard from "../ProductCard/ProductCard";

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
    <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-secondary md:text-4xl">
        {activeCat ?? "All Products"}
      </h1>

      <div className="mt-6 flex gap-8">
        {/* Sidebar — subcategory links */}
        <aside className="hidden w-56 shrink-0 lg:block">
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

          <p className="mt-5 flex items-center gap-1.5 text-sm text-gray-500">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            <Info size={14} className="text-gray-400" />
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
