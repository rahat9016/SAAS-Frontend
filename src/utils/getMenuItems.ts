import {
  Layers,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  segment?: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  matchRoutes?: string[];
  children?: { label: string; href: string; matchRoutes?: string[] }[];
}

export function getMenuItems(): MenuItem[] {
  const menuItems: (MenuItem | false)[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    {
      segment: "Product Management",
      label: "Manage Product",
      icon: Package,
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
      children: [
        {
          label: "Category List",
          href: "/admin/category",
          matchRoutes: [
            "/admin/parent-category",
            "/admin/category",
            "/admin/sub-category",
          ],
        },
        { label: "Attribute List", href: "/admin/products/attributes", matchRoutes: ["/admin/products/attributes", "/admin/products/attribute-values"] },
        { label: "Tag List", href: "/admin/products/tags" },
        { label: "Brand List", href: "/admin/brands" },
      ],
    },
    {
      segment: "Order Management",
      label: "Orders",
      icon: ShoppingCart,
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
    },
    {
      label: "Admin",
      icon: Settings,
      href: "/admin/admin",
    },
  ];

  return menuItems.filter(Boolean) as MenuItem[];
}
