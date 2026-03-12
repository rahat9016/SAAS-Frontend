import { NextResponse } from "next/server";

const stats = [
  { key: "total-sales", value: "৳12,48,500", change: "+12.5%", isPositive: true },
  { key: "total-orders", value: "1,245", change: "+8.2%", isPositive: true },
  { key: "revenue", value: "৳8,32,000", change: "+5.1%", isPositive: true },
  { key: "new-customers", value: "324", change: "-2.4%", isPositive: false },
];

export async function GET() {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 800));
  return NextResponse.json({ data: stats });
}
