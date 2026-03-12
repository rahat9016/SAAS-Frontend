import { NextResponse } from "next/server";

const stats = [
  {
    label: "Total Sales",
    value: "৳12,48,500",
    change: "+12.5%",
    isPositive: true,
    iconName: "ShoppingCart",
    gradient: "from-[#009dab] to-[#00c9db]",
  },
  {
    label: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    isPositive: true,
    iconName: "ClipboardList",
    gradient: "from-[#4f46e5] to-[#818cf8]",
  },
  {
    label: "Revenue",
    value: "৳8,32,000",
    change: "+5.1%",
    isPositive: true,
    iconName: "TrendingUp",
    gradient: "from-[#059669] to-[#34d399]",
  },
  {
    label: "New Customers",
    value: "324",
    change: "-2.4%",
    isPositive: false,
    iconName: "Users",
    gradient: "from-[#d97706] to-[#fbbf24]",
  },
];

export async function GET() {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 800));
  return NextResponse.json({ data: stats });
}
