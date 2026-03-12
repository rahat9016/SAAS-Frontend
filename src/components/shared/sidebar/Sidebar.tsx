"use client";

import { siteConfig } from "@/src/config/siteConfig";
import { logoutUser } from "@/src/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import { getMenuItems } from "@/src/utils/getMenuItems";
import { ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Image from "next/image";
import { Button } from "../../ui/button";

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({
  className,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const menuItems = getMenuItems();

  // Track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent item if a child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => pathname === child.href
        );
        if (
          hasActiveChild &&
          !expandedItems.includes(item.label)
        ) {
          setExpandedItems((prev) => [...prev, item.label]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-70 bg-white border-r border-skeleton flex flex-col px-4 sm:px-5 transition-transform duration-300 ease-in-out z-50",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0 lg:static": true,
          },
          className
        )}
      >
        <div
          onClick={() => router.push("/")}
          className="flex flex-row items-center cursor-pointer gap-1 h-18"
        >
          <Image
            width={216}
            height={216}
            src="/logo.png"
            alt="logo"
            className="w-13"
          />
          <div>
            <h3 className="text-base text-secondary-dark font-semibold">
              {siteConfig.name}
            </h3>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar mt-4">
          <div className="flex flex-col gap-1 py-1">
            {menuItems.map((item) => {
              const isActiveParent = item.href && pathname === item.href;
              const isActiveChild = item.children?.some(
                (child) => pathname === child.href
              );
              const isActive = isActiveParent || isActiveChild;
              const isExpanded = expandedItems.includes(item.label);

              if (item.children) {
                return (
                  <div key={item.label}>
                    {/* Parent with children */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.label)}
                      className={cn(
                        "w-full h-11 flex items-center justify-between px-3 rounded-sm text-sm font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-secondary text-white"
                          : "text-secondary-dark hover:bg-[#EAF6FB] hover:text-primary"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={item.icon}
                          alt=""
                          width={22}
                          height={22}
                          className={cn(
                            isActive ? "brightness-0 invert" : ""
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isExpanded ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {/* Children with left border */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        isExpanded
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="ml-6 mt-1 border-l-2 border-gray-200 pl-3">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href;

                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "flex items-center h-10 px-3 rounded-sm text-sm transition-colors",
                                isChildActive
                                  ? "text-primary font-medium bg-[#EAF6FB]"
                                  : "text-[#6B7280] hover:text-primary hover:bg-[#EAF6FB]"
                              )}
                            >
                              <span className="truncate">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              // Simple link item (no children)
              return (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "w-full h-11 flex items-center gap-2.5 px-3 text-sm rounded-sm transition-colors",
                    isActive
                      ? "bg-secondary text-white font-medium"
                      : "text-secondary-dark font-normal hover:bg-[#EAF6FB] hover:text-primary"
                  )}
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={22}
                    height={22}
                    className={cn(isActive ? "brightness-0 invert" : "")}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="pb-2 mt-4">
          <Button
            onClick={() => {
              dispatch(logoutUser());
              setIsOpen(false);
            }}
            className="w-full bg-[#fde2e2] hover:bg-[#FDECEC] text-[#A8A8A8] hover:text-[#EB5757] flex items-center justify-start gap-2 h-10 sm:h-12 px-3! sm:px-4! text-sm sm:text-base"
          >
            <LogOut className="h-4 w-4 sm:h-6 sm:w-6" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
