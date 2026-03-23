import {
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  Users,
  DollarSign,
  RotateCcw,
  Wallet,
  BarChart3,
  Clock,
  Percent,
} from "lucide-react";
import { financeStats } from "@/src/data/financeData";
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

// Finance stat cards (static data)
export const financeCardConfigs: (StatCardConfig & {
  value: string;
  change: string;
  isPositive: boolean;
  sub: string;
})[] = [
  {
    key: "today-revenue",
    label: "Today's Revenue",
    value: `৳${financeStats.todayRevenue.toLocaleString()}`,
    change: "+12.5%",
    isPositive: true,
    sub: "vs yesterday",
    icon: DollarSign,
    gradient: "from-emerald-500 to-green-400",
  },
  {
    key: "today-orders",
    label: "Today's Orders",
    value: financeStats.todayOrders.toString(),
    change: "+8.2%",
    isPositive: true,
    sub: "vs yesterday",
    icon: ShoppingCart,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    key: "today-profit",
    label: "Today's Profit",
    value: `৳${financeStats.todayProfit.toLocaleString()}`,
    change: "+15.3%",
    isPositive: true,
    sub: "vs yesterday",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-400",
  },
  {
    key: "today-refunds",
    label: "Today's Refunds",
    value: `৳${financeStats.todayRefunds.toLocaleString()}`,
    change: "-3.1%",
    isPositive: false,
    sub: "vs yesterday",
    icon: RotateCcw,
    gradient: "from-rose-500 to-pink-400",
  },
  {
    key: "week-revenue",
    label: "This Week Revenue",
    value: `৳${financeStats.weekRevenue.toLocaleString()}`,
    change: "+22.1%",
    isPositive: true,
    sub: "vs last week",
    icon: Wallet,
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    key: "avg-order-value",
    label: "Avg. Order Value",
    value: `৳${financeStats.avgOrderValue.toLocaleString()}`,
    change: "+5.7%",
    isPositive: true,
    sub: "vs last month",
    icon: BarChart3,
    gradient: "from-teal-500 to-emerald-400",
  },
  {
    key: "pending-payments",
    label: "Pending Payments",
    value: `৳${financeStats.pendingPayments.toLocaleString()}`,
    change: "3 orders",
    isPositive: false,
    sub: "awaiting",
    icon: Clock,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    key: "conversion-rate",
    label: "Conversion Rate",
    value: `${financeStats.conversionRate}%`,
    change: "+2.4%",
    isPositive: true,
    sub: "vs last month",
    icon: Percent,
    gradient: "from-indigo-500 to-blue-400",
  },
];
