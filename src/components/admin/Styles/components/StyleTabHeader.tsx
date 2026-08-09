"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface StyleTabHeaderProps {
  activeTab?: string;
}

export default function StyleTabHeader({ activeTab = "Style" }: StyleTabHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { label: "Style", href: "/admin/styles" },
    { label: "Material", href: "#" },
    { label: "Size Chart Template", href: "#" },
    { label: "Care Label Info", href: "#" },
    { label: "Supplier", href: "#" },
    { label: "Documents", href: "#" },
  ];

  return (
    <div className="w-full border border-orange-300 rounded-md p-1 bg-white mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {tabs.map((tab) => {
          const isActive = tab.label === activeTab || (tab.label === "Style" && pathname.startsWith("/admin/styles"));
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-1.5 text-sm font-medium transition-all border rounded ${
                isActive
                  ? "border-orange-400 text-emerald-700 bg-emerald-50/50 shadow-sm"
                  : "border-transparent text-emerald-600 hover:text-emerald-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
