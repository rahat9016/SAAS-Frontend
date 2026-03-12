import { NextResponse } from "next/server";

const revenueData = [
  { month: "Sep", revenue: 320000, orders: 180 },
  { month: "Oct", revenue: 480000, orders: 240 },
  { month: "Nov", revenue: 410000, orders: 210 },
  { month: "Dec", revenue: 620000, orders: 320 },
  { month: "Jan", revenue: 550000, orders: 290 },
  { month: "Feb", revenue: 730000, orders: 380 },
  { month: "Mar", revenue: 832000, orders: 410 },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 1000));

  const totalMonths = revenueData.length;
  const previous = revenueData[totalMonths - 2].revenue;
  const current = revenueData[totalMonths - 1].revenue;
  const growth = ((current - previous) / previous) * 100;
  const growthPercent = `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;

  return NextResponse.json({
    data: {
      points: revenueData,
      totalMonths,
      growthPercent,
    },
  });
}
