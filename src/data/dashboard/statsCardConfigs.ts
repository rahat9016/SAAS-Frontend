import type { StatCardConfig } from "@/src/types/dashboard/dashboard";
import { ClipboardList, Clock, ShoppingCart, Users } from "lucide-react";

export const statsCardConfigs: StatCardConfig[] = [
  {
    key: "total-sales",
    label: "Total Sales",
    icon: ShoppingCart,
    gradient: "from-[#009dab] to-[#00c9db]",
  },
  {
    key: "total-orders",
    label: "Total Orders",
    icon: ClipboardList,
    gradient: "from-[#4f46e5] to-[#818cf8]",
  },
  {
    key: "total-customers",
    label: "Total Customers",
    icon: Users,
    gradient: "from-[#d97706] to-[#fbbf24]",
  },
  {
    key: "pending-payments",
    label: "Pending Payments",
    icon: Clock,
    gradient: "from-orange-500 to-amber-400",
  },
];
