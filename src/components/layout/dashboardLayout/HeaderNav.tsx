"use client";

import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import {
  filterMenuByAccess,
  getMenuItems,
  type MenuItem,
} from "@/src/utils/getMenuItems";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

function isChildMatch(
  href: string,
  matchRoutes: string[] | undefined,
  pathname: string
) {
  if (pathname === href) return true;
  if (href !== "/admin" && pathname.startsWith(href)) return true;
  if (matchRoutes && matchRoutes.some((r) => pathname.startsWith(r))) return true;
  return false;
}

function isItemActive(item: MenuItem, pathname: string) {
  const isActiveParent = item.href ? pathname === item.href : false;
  const isActiveChild =
    item.children?.some((c) => isChildMatch(c.href, c.matchRoutes, pathname)) ??
    false;
  return isActiveParent || isActiveChild;
}

export default function HeaderNav() {
  const pathname = usePathname();
  useRbacPermissions();
  const rbac = useAppSelector(selectRbac);

  const menuItems = useMemo(() => {
    const hasPermissions =
      rbac.loaded && Object.keys(rbac.permissions ?? {}).length > 0;
    const can = (resource: string) => {
      if (!hasPermissions) return true;
      if (rbac.user.isSuperAdmin) return true;
      const resourcePerms = rbac.permissions[resource];
      if (!resourcePerms) return true;
      return Object.values(resourcePerms).some(Boolean);
    };
    return filterMenuByAccess(getMenuItems(), can, rbac.user.isSuperAdmin);
  }, [rbac]);

  return (
    <div className="h-11 flex items-center justify-center px-3 md:px-6 border-t border-skeleton">
      {/* Desktop: full horizontal nav */}
      <nav className="hidden lg:flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = isItemActive(item, pathname);
          const itemClass = cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
            isActive
              ? "text-primary bg-gray-100"
              : "text-secondary-dark hover:bg-gray-100 hover:text-primary"
          );

          if (item.children) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={itemClass}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link
                        href={child.href}
                        className={cn(
                          isChildMatch(child.href, child.matchRoutes, pathname) &&
                            "text-primary font-medium"
                        )}
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Link key={item.label} href={item.href ?? "#"} className={itemClass}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile / tablet: collapsed menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium text-secondary-dark hover:bg-gray-100"
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {menuItems.map((item) =>
            item.children ? (
              <DropdownMenuSub key={item.label}>
                <DropdownMenuSubTrigger className="gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild>
                      <Link href={child.href}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href ?? "#"}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
