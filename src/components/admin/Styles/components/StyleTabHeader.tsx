"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface StyleTab {
  label: string;
  href: string;
  /** Extra prefixes that keep this tab active (drill-down routes). */
  matchPrefixes?: string[];
}

export const STYLE_TABS: StyleTab[] = [
  { label: "Style", href: "/admin/styles" },
  { label: "Material", href: "/admin/styles/material" },
  { label: "Size Chart Template", href: "/admin/styles/size-chart-template" },
  { label: "Care Label Info", href: "/admin/styles/care-label-info" },
  { label: "Supplier", href: "/admin/styles/supplier" },
  { label: "Documents", href: "/admin/styles/documents" },
];

function isTabActive(tab: StyleTab, pathname: string) {
  if (pathname === tab.href) return true;
  if (tab.href !== "/admin/styles" && pathname.startsWith(`${tab.href}/`)) {
    return true;
  }
  // "Style" also owns the season → department → category → article drill-down,
  // which lives under /admin/styles/<seasonId>/...
  if (tab.href === "/admin/styles") {
    const otherTab = STYLE_TABS.some(
      (t) => t.href !== "/admin/styles" && (pathname === t.href || pathname.startsWith(`${t.href}/`))
    );
    return !otherTab && pathname.startsWith("/admin/styles");
  }
  return false;
}

export default function StyleTabHeader() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Style sections"
      className="w-full border-b border-border mb-6 overflow-x-auto scrollbar-hide"
    >
      <div className="flex w-max min-w-full items-center gap-2">
        {STYLE_TABS.map((tab) => {
          const isActive = isTabActive(tab, pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-secondary-dark hover:text-primary"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
