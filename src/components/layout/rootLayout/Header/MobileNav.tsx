"use client";

import { Category, dummyCategories } from "@/src/data/dummyCategories";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  Baby,
  BookOpen,
  Car,
  ChevronDown,
  ChevronRight,
  Cpu,
  Dumbbell,
  Heart,
  Home,
  LayoutGrid,
  Monitor,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Sofa,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { navLinks } from "./navLinks";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={16} />,
  Cpu: <Cpu size={16} />,
  Smartphone: <Smartphone size={16} />,
  Shirt: <Shirt size={16} />,
  Baby: <Baby size={16} />,
  Sofa: <Sofa size={16} />,
  ShoppingBasket: <ShoppingBasket size={16} />,
  Heart: <Heart size={16} />,
  BookOpen: <BookOpen size={16} />,
  Dumbbell: <Dumbbell size={16} />,
  Car: <Car size={16} />,
};

/* ─── Recursive mobile category accordion ─── */
function MobileCategoryItem({
  category,
  depth = 0,
  onClose,
}: {
  category: Category;
  depth?: number;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={`/categories/${category.slug}`}
          onClick={onClose}
          className={`flex-1 flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-primary transition-colors ${
            depth === 0 ? "font-medium text-gray-700" : ""
          }`}
          style={{ paddingLeft: `${depth * 12}px` }}
        >
          {depth === 0 && category.icon && (
            <span className="text-gray-400">{iconMap[category.icon]}</span>
          )}
          <span>{category.name}</span>
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
          >
            {expanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="ml-3 border-l border-gray-100 pl-2">
          {category.children!.map((child) => (
            <MobileCategoryItem
              key={child.id}
              category={child}
              depth={depth + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MobileNavProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileNav({ open, setOpen }: MobileNavProps) {
  const [showCategories, setShowCategories] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ═══════ MOBILE BOTTOM NAV — 4-item AliExpress style ═══════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-14">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              pathname === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home size={22} strokeWidth={pathname === "/" ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Category */}
          <button
            onClick={() => setOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              open ? "text-primary" : "text-gray-500"
            }`}
          >
            <LayoutGrid size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Category</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              pathname === "/cart" ? "text-primary" : "text-gray-500"
            }`}
          >
            <ShoppingCart
              size={22}
              strokeWidth={pathname === "/cart" ? 2.5 : 1.5}
            />
            <span className="text-[10px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-2 min-w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold px-0.5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 ${
              pathname === "/account" ? "text-primary" : "text-gray-500"
            }`}
          >
            <User
              size={22}
              strokeWidth={pathname === "/account" ? 2.5 : 1.5}
            />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </div>

      {/* ═══════ Category Drawer ═══════ */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-60"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-70 h-screen w-80 bg-white transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <span className="font-semibold text-lg text-gray-800">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-0.5">
          {/* Nav links */}
          {navLinks
            .filter((l) => l.label !== "All Categories")
            .map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`py-2.5 px-3 rounded-md text-sm ${
                  pathname === href
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}

          {/* Divider */}
          <div className="my-2 border-t border-gray-100" />

          {/* Categories Section */}
          <button
            onClick={() => setShowCategories((p) => !p)}
            className="flex items-center justify-between w-full py-2.5 px-3 font-semibold text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <span className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-gray-500" />
              All Categories
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform text-gray-400 ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCategories && (
            <div className="pl-2 flex flex-col gap-0.5">
              {dummyCategories.map((cat) => (
                <MobileCategoryItem
                  key={cat.id}
                  category={cat}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/auth/login");
            }}
            className="w-full bg-primary text-white text-center rounded-md py-2.5 font-medium text-sm"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    </>
  );
}
