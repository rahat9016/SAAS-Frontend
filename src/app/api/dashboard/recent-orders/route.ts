import { NextResponse } from "next/server";

const orders = [
  { id: "#ORD-7291", customer: "Rahim Uddin", date: "12 Mar 2026", amount: "৳24,500", status: "Completed" },
  { id: "#ORD-7290", customer: "Fatema Akter", date: "11 Mar 2026", amount: "৳18,200", status: "Processing" },
  { id: "#ORD-7289", customer: "Kamal Hossain", date: "11 Mar 2026", amount: "৳32,800", status: "Completed" },
  { id: "#ORD-7288", customer: "Nasima Begum", date: "10 Mar 2026", amount: "৳12,350", status: "Cancelled" },
  { id: "#ORD-7287", customer: "Jamal Uddin", date: "10 Mar 2026", amount: "৳45,600", status: "Completed" },
  { id: "#ORD-7286", customer: "Sharmin Sultana", date: "09 Mar 2026", amount: "৳9,800", status: "Processing" },
];

export async function GET() {
  await new Promise((res) => setTimeout(res, 850));
  return NextResponse.json({ data: orders });
}
