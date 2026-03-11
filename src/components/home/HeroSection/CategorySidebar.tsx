"use client";

import { Category, dummyCategories } from "@/src/data/dummyCategories";
import {
  Baby,
  BookOpen,
  Car,
  ChevronRight,
  Cpu,
  Dumbbell,
  Heart,
  Menu,
  Monitor,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={18} />,
  Cpu: <Cpu size={18} />,
  Smartphone: <Smartphone size={18} />,
  Shirt: <Shirt size={18} />,
  Baby: <Baby size={18} />,
  Sofa: <Sofa size={18} />,
  ShoppingBasket: <ShoppingBasket size={18} />,
  Heart: <Heart size={18} />,
  BookOpen: <BookOpen size={18} />,
  Dumbbell: <Dumbbell size={18} />,
  Car: <Car size={18} />,
};

/* ─── Recursive submenu items ─── */
function CategoryChildren({
  categories,
  depth = 0,
}: {
  categories: Category[];
  depth?: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col">
      {categories.map((cat) => {
        const hasChildren = cat.children && cat.children.length > 0;

        return (
          <li
            key={cat.id}
            className="relative"
            onMouseEnter={() => setHoveredId(cat.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="flex items-center justify-between gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="truncate">{cat.name}</span>
              {hasChildren && (
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
              )}
            </Link>

            {/* Recursive fly-out */}
            {hasChildren && hoveredId === cat.id && (
              <div
                className="absolute left-full top-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] z-10"
                style={{ marginLeft: 2 }}
              >
                <CategoryChildren
                  categories={cat.children!}
                  depth={depth + 1}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ─── Main sidebar ─── */
export default function CategorySidebar() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white rounded-lg border border-gray-200 relative">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-11 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <Menu size={16} className="text-gray-600" />
        <span className="text-sm font-semibold text-gray-700 tracking-wide">
          Browse Categories
        </span>
      </div>

      {/* Category list — no overflow hidden so fly-outs can appear */}
      <nav className="flex flex-col py-1">
        {dummyCategories.map((cat) => {
          const hasChildren = cat.children && cat.children.length > 0;

          return (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors group"
              >
                <span className="text-gray-500 group-hover:text-primary transition-colors shrink-0">
                  {cat.icon && iconMap[cat.icon]}
                </span>
                <span className="flex-1 truncate font-medium">{cat.name}</span>
                {hasChildren && (
                  <ChevronRight
                    size={14}
                    className="text-gray-400 group-hover:text-primary shrink-0"
                  />
                )}
              </Link>

              {/* First-level fly-out */}
              {hasChildren && hoveredId === cat.id && (
                <div className="absolute left-full top-0 bg-white rounded-md shadow-xl border border-gray-100 min-w-[220px] z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {cat.name}
                    </span>
                  </div>
                  <CategoryChildren categories={cat.children!} />
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
