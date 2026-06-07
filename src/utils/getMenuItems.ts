import {
  Layers,
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface MenuChild {
  label: string;
  href: string;
  matchRoutes?: string[];
  /** RBAC resource gating this child; omit = always visible. */
  resource?: string;
}

export interface MenuItem {
  segment?: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  matchRoutes?: string[];
  children?: MenuChild[];
  /** RBAC resource gating this item/group; omit = always visible. */
  resource?: string;
}

export function getMenuItems(): MenuItem[] {
  const menuItems: (MenuItem | false)[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    {
      segment: "Product Management",
      label: "Manage Product",
      icon: Package,
      resource: "products",
      children: [
        { label: "All Products", href: "/admin/products" },
        { label: "Draft Product", href: "/admin/products/draft" },
        { label: "Stock Products", href: "/admin/products/stock" },
        { label: "Product Review", href: "/admin/products/review" },
      ],
    },
    {
      label: "Categories & Attributes",
      icon: Layers,
      segment: "Product Management",
      resource: "products",
      children: [
        {
          label: "Category List",
          href: "/admin/parent-category",
          matchRoutes: [
            "/admin/parent-category",
            "/admin/category",
            "/admin/sub-category",
          ],
        },
        {
          label: "Attribute List",
          href: "/admin/products/attributes",
          matchRoutes: [
            "/admin/products/attributes",
            "/admin/products/attribute-values",
          ],
        },
        { label: "Brand List", href: "/admin/brands" },
      ],
    },
    {
      segment: "Order Management",
      label: "Orders",
      icon: ShoppingCart,
      resource: "orders",
      children: [
        { label: "All Orders", href: "/admin/orders" },
        { label: "Return & Refund", href: "/admin/orders/return-refund" },
        { label: "Transactions", href: "/admin/orders/transactions" },
      ],
    },
    {
      segment: "User Management",
      label: "Users",
      icon: Users,
      href: "/admin/users",
      resource: "customers",
    },
    {
      segment: "Access Control",
      label: "Branch RBAC",
      icon: ShieldCheck,
      children: [
        { label: "Branches", href: "/admin/rbac/branches", resource: "branches" },
        { label: "Roles", href: "/admin/rbac/roles", resource: "roles" },
        { label: "Actions", href: "/admin/rbac/actions", resource: "actions" },
        { label: "Users", href: "/admin/rbac/users", resource: "users" },
        { label: "Permissions", href: "/admin/rbac/permissions", resource: "users" },
      ],
    },
    {
      label: "Admin",
      icon: Settings,
      href: "/admin/admin",
    },
  ];

  return menuItems.filter(Boolean) as MenuItem[];
}

/**
 * Filter menu items by the user's RBAC access.
 * `can(resource)` → true if the user may see that resource (super admin
 * bypasses; otherwise any granted action counts).
 *  - leaf/group with a `resource` → hidden unless `can(resource)`.
 *  - group children with a `resource` → individually filtered.
 *  - a group with no remaining children is dropped.
 */
export function filterMenuByAccess(
  items: MenuItem[],
  can: (resource: string) => boolean,
): MenuItem[] {
  const out: MenuItem[] = [];
  for (const item of items) {
    if (item.resource && !can(item.resource)) continue;

    if (item.children) {
      const children = item.children.filter((c) => !c.resource || can(c.resource));
      if (children.length === 0) continue;
      out.push({ ...item, children });
    } else {
      out.push(item);
    }
  }
  return out;
}
