"use client";

import { useAppSelector } from "@/src/lib/redux/hooks";
import {
    ChevronDown,
    Heart,
    Home,
    Menu,
    Search,
    ShoppingCart,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { navLinks } from "./navLinks";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistIds = useAppSelector((state) => state.wishlist.productIds);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Mobile Bottom Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-14">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 text-[10px] ${
              pathname === "/" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/search"
            className={`flex flex-col items-center gap-0.5 text-[10px] ${
              pathname === "/search" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Search size={20} />
            Search
          </Link>
          <Link
            href="/wishlist"
            className={`relative flex flex-col items-center gap-0.5 text-[10px] ${
              pathname === "/wishlist" ? "text-primary" : "text-gray-500"
            }`}
          >
            <Heart size={20} />
            Wishlist
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 right-0 min-w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold px-0.5">
                {wishlistIds.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className={`relative flex flex-col items-center gap-0.5 text-[10px] ${
              pathname === "/cart" ? "text-primary" : "text-gray-500"
            }`}
          >
            <ShoppingCart size={20} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1 right-0 min-w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold px-0.5">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/account"
            className={`flex flex-col items-center gap-0.5 text-[10px] ${
              pathname === "/account" ? "text-primary" : "text-gray-500"
            }`}
          >
            <User size={20} />
            Account
          </Link>
        </div>
      </div>

      {/* Mobile Category Drawer (triggered from hamburger in mobile search area) */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600"
        >
          <Menu size={18} />
          <span className="hidden sm:inline">Categories</span>
        </button>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 z-[70] h-screen w-72 bg-white transform transition-transform duration-300 flex flex-col ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <span className="font-semibold text-lg text-gray-800">Menu</span>
            <button onClick={() => setOpen(false)}>
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => {
              if (label === "All Categories") {
                return (
                  <div key={label}>
                    <button
                      onClick={() => setCategoriesOpen((p) => !p)}
                      className="flex items-center justify-between w-full py-2.5 px-3 font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      {label}
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${
                          categoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {categoriesOpen && (
                      <div className="pl-4 mt-1 flex flex-col gap-1">
                        <Link
                          href="/categories"
                          onClick={() => setOpen(false)}
                          className="py-2 px-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                        >
                          View All Categories
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
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
              );
            })}
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
      </div>
    </>
  );
}
