import { NextResponse } from "next/server";

const stats = [
  {
    key: "total-sales",
    value: "৳12,48,500",
    change: "+12.5%",
    isPositive: true,
  },
  { key: "total-orders", value: "1,245", change: "+8.2%", isPositive: true },
  { key: "total-customers", value: "3,240", change: "+5.4%", isPositive: true },
  {
    key: "pending-payments",
    value: "৳1,28,000",
    change: "3 pending",
    isPositive: false,
  },
];

export async function GET() {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 800));
  return NextResponse.json({ data: stats });
}
