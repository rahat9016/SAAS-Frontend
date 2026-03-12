import type { LucideIcon } from "lucide-react";

// ── Stats Cards ──────────────────────────────────────────

/** Static card config (title, icon, colors) — lives in the component */
export interface StatCardConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
}

/** Dynamic data returned from the API for stats */
export interface DashboardStatResponse {
  key: string;
  value: string;
  change: string;
  isPositive: boolean;
}

// ── Best Selling Products ────────────────────────────────

export interface BestSellingProduct {
  rank: number;
  name: string;
  sold: number;
  revenue: string;
  percent: number;
  color: string;
}

// ── Revenue Chart ────────────────────────────────────────

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

// ── Recent Orders ────────────────────────────────────────

export type OrderStatus = "Completed" | "Processing" | "Cancelled";

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: OrderStatus;
}
