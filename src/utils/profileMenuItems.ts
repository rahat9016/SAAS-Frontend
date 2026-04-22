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

export const adminMenuItems = [
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Go to Storefront", href: "/", icon: Home },
  { label: "Manage Products", href: "/admin/products", icon: Package },
  { label: "Manage Users", href: "/admin/users", icon: User },
];
