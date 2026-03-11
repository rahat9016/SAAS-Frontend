"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "./navLinks";

export default function NavItems() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:block bg-gray-50 border-b border-gray-100">
      <div className="container flex items-center h-10">
        {/* All Categories with icon */}
        <Link
          href="/categories"
          className="flex items-center gap-1.5 pr-5 mr-2 border-r border-gray-200 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          <Menu size={16} />
          <span>All Categories</span>
          <ChevronDown size={14} />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {navLinks.slice(1).map(({ label, href, isHighlighted }) => {
            const isActive = pathname === href || pathname.startsWith(href.split("?")[0] + "/");

            return (
              <Link
                key={label}
                href={href}
                className={`px-3 py-1.5 text-sm rounded-sm transition-colors whitespace-nowrap ${
                  isHighlighted
                    ? "font-bold text-red-500 hover:text-red-600"
                    : isActive
                    ? "text-primary font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* More dropdown (for overflow) */}
        <button className="ml-auto flex items-center gap-0.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          More
          <ChevronDown size={14} />
        </button>
      </div>
    </nav>
  );
}
