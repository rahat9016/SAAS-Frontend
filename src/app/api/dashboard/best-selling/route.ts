import { NextResponse } from "next/server";

const products = [
  { rank: 1, name: "Portland Composite Cement (PCC)", sold: 482, revenue: "৳3,85,600", percent: 92, color: "#009dab" },
  { rank: 2, name: "Super Admixture Grade-A", sold: 356, revenue: "৳2,84,800", percent: 76, color: "#4f46e5" },
  { rank: 3, name: "Weather Shield Paint (20L)", sold: 298, revenue: "৳2,38,400", percent: 64, color: "#059669" },
  { rank: 4, name: "TMT Steel Rod 12mm", sold: 215, revenue: "৳1,72,000", percent: 48, color: "#d97706" },
  { rank: 5, name: "Rapid Set Cement (50kg)", sold: 164, revenue: "৳1,31,200", percent: 35, color: "#e11d48" },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 900));
  return NextResponse.json({ data: products });
}
