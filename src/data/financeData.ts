import { dummyOrders } from "./dummyOrders";
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/src/types/ecommerce/order";

// ── Types ──
export interface DailySaleEntry {
  date: string;
  orders: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface FinanceStats {
  todayRevenue: number;
  todayOrders: number;
  todayProfit: number;
  todayRefunds: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
  avgOrderValue: number;
  pendingPayments: number;
  totalRefunded: number;
  conversionRate: number;
}

export interface TransactionEntry {
  id: string;
  date: string;
  orderNumber: string;
  customer: string;
  method: string;
  type: "payment" | "refund";
  amount: number;
  status: "success" | "pending" | "failed";
  note?: string;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface RevenueByDay {
  day: string;
  revenue: number;
  orders: number;
  refunds: number;
}

// ── Generate last 30 days of sales data ──
function generateDailySales(): DailySaleEntry[] {
  const days: DailySaleEntry[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const revenue = Math.floor(8000 + Math.random() * 25000);
    const cost = Math.floor(revenue * (0.35 + Math.random() * 0.15));
    days.push({
      date: d.toISOString().slice(0, 10),
      orders: Math.floor(5 + Math.random() * 30),
      revenue,
      cost,
      profit: revenue - cost,
    });
  }
  return days;
}

// ── Stats derived from orders ──
function computeFinanceStats(): FinanceStats {
  const delivered = dummyOrders.filter(
    (o) => o.orderStatus === OrderStatus.DELIVERED
  );
  const totalRev = delivered.reduce((s, o) => s + o.total, 0);
  const refunded = dummyOrders.filter(
    (o) => o.paymentStatus === PaymentStatus.REFUNDED
  );
  const totalRefunded = refunded.reduce((s, o) => s + o.total, 0);
  const pending = dummyOrders.filter(
    (o) => o.paymentStatus === PaymentStatus.PENDING
  );
  const pendingPayments = pending.reduce((s, o) => s + o.total, 0);

  return {
    todayRevenue: 18750,
    todayOrders: 14,
    todayProfit: 11230,
    todayRefunds: 1798,
    weekRevenue: 127500,
    weekOrders: 89,
    monthRevenue: totalRev > 0 ? totalRev : 485000,
    monthOrders: delivered.length > 0 ? delivered.length : 312,
    avgOrderValue: Math.round(totalRev / Math.max(delivered.length, 1)),
    pendingPayments,
    totalRefunded,
    conversionRate: 68.4,
  };
}

// ── Recent transactions ──
function generateTransactions(): TransactionEntry[] {
  const txns: TransactionEntry[] = [];

  dummyOrders.forEach((order) => {
    if (order.paymentHistory) {
      order.paymentHistory.forEach((ph) => {
        txns.push({
          id: ph.id,
          date: ph.date,
          orderNumber: order.orderNumber,
          customer: order.shippingAddress.fullName,
          method: ph.method,
          type: ph.type as "payment" | "refund",
          amount: ph.type === "refund" ? -ph.amount : ph.amount,
          status: ph.status as "success" | "pending" | "failed",
          note: ph.note,
        });
      });
    }
  });

  // Add some extra transactions for richness
  txns.push(
    {
      id: "txn-extra-1",
      date: "2026-03-23T14:30:00Z",
      orderNumber: "ORD-2026-010",
      customer: "Nasir Hossain",
      method: PaymentMethod.BKASH,
      type: "payment",
      amount: 3250,
      status: "success",
    },
    {
      id: "txn-extra-2",
      date: "2026-03-23T11:15:00Z",
      orderNumber: "ORD-2026-011",
      customer: "Sufia Begum",
      method: PaymentMethod.NAGAD,
      type: "payment",
      amount: 5890,
      status: "success",
    },
    {
      id: "txn-extra-3",
      date: "2026-03-23T09:00:00Z",
      orderNumber: "ORD-2026-012",
      customer: "Arif Khan",
      method: PaymentMethod.COD,
      type: "payment",
      amount: 2100,
      status: "pending",
    },
    {
      id: "txn-extra-4",
      date: "2026-03-22T16:45:00Z",
      orderNumber: "ORD-2026-013",
      customer: "Rupa Das",
      method: PaymentMethod.SSLCOMMERZ,
      type: "payment",
      amount: 7450,
      status: "success",
    },
    {
      id: "txn-extra-5",
      date: "2026-03-22T10:20:00Z",
      orderNumber: "ORD-2026-014",
      customer: "Jahangir Alam",
      method: PaymentMethod.STRIPE,
      type: "payment",
      amount: 12300,
      status: "failed",
      note: "Card declined",
    }
  );

  return txns.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// ── Payment method breakdown ──
function computeMethodBreakdown(): PaymentMethodBreakdown[] {
  const methods: Record<string, { count: number; amount: number }> = {};
  dummyOrders.forEach((o) => {
    if (!methods[o.paymentMethod]) {
      methods[o.paymentMethod] = { count: 0, amount: 0 };
    }
    methods[o.paymentMethod].count++;
    methods[o.paymentMethod].amount += o.total;
  });
  const total = Object.values(methods).reduce((s, m) => s + m.amount, 0);
  return Object.entries(methods)
    .map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
      percentage: Math.round((data.amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}

// ── Last 7 days revenue ──
function generateWeeklyRevenue(): RevenueByDay[] {
  const days: RevenueByDay[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      day: dayNames[d.getDay()],
      revenue: Math.floor(12000 + Math.random() * 20000),
      orders: Math.floor(8 + Math.random() * 25),
      refunds: Math.floor(Math.random() * 3000),
    });
  }
  return days;
}

// ── Exports ──
export const dailySales = generateDailySales();
export const financeStats = computeFinanceStats();
export const recentTransactions = generateTransactions();
export const paymentMethodBreakdown = computeMethodBreakdown();
export const weeklyRevenue = generateWeeklyRevenue();
