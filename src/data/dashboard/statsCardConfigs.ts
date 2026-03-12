import {
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  Users,
} from "lucide-react";
import type { StatCardConfig } from "@/src/types/dashboard/dashboard";

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
    key: "revenue",
    label: "Revenue",
    icon: TrendingUp,
    gradient: "from-[#059669] to-[#34d399]",
  },
  {
    key: "new-customers",
    label: "New Customers",
    icon: Users,
    gradient: "from-[#d97706] to-[#fbbf24]",
  },
];
