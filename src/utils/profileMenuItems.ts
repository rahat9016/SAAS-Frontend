import {
    CreditCard,
    Home,
    LayoutDashboard,
    MapPin,
    Package,
    RotateCcw,
    User,
    XCircle,
} from "lucide-react";

export const userMenuItems = [
  { label: "My Profile", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Returns", href: "/account/returns", icon: RotateCcw },
  { label: "Cancellations", href: "/account/cancellations", icon: XCircle },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  {
    label: "Payment Methods",
    href: "/account/payment-methods",
    icon: CreditCard,
  },
];

const pick = (...hrefs: string[]) =>
  hrefs.map((href) => userMenuItems.find((item) => item.href === href)!);

export const sidebarSections = [
  {
    title: "Manage My Account",
    items: pick("/account", "/account/addresses", "/account/payment-methods"),
  },
  {
    title: "My Orders",
    items: pick(
      "/account/orders",
      "/account/returns",
      "/account/cancellations"
    ),
  },
];

export const adminMenuItems = [
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Go to Storefront", href: "/", icon: Home },
  { label: "Manage Users", href: "/admin/users", icon: User },
];
