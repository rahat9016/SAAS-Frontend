import { dummyOrders } from "./dummyOrders";
import {
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/src/types/ecommerce/order";

// ══════════════════════════════════════════
//  EXISTING TYPES
// ══════════════════════════════════════════

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

// ══════════════════════════════════════════
//  NEW TYPES — Finance Admin Page
// ══════════════════════════════════════════

export type OrderPaymentStatus = "PAID" | "UNPAID" | "PARTIAL";

export interface OrderPaymentRow {
  orderId: string;
  orderNumber: string;
  customer: string;
  total: number;
  paid: number;
  due: number;
  status: OrderPaymentStatus;
  date: string;
}

export interface ReturnEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  product: string;
  quantity: number;
  refundAmount: number;
  returnReason: string;
  type: "Full" | "Partial";
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: "Sale" | "Refund" | "Expense";
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface LossEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  reason: string;
  lossAmount: number;
  date: string;
}

export interface OrderProfitRow {
  orderId: string;
  orderNumber: string;
  customer: string;
  sellingPrice: number;
  productCost: number;
  deliveryCost: number;
  discount: number;
  refund: number;
  profit: number;
  date: string;
}

export interface FinanceOverviewStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  paidTotal: number;
  unpaidTotal: number;
  returnTotal: number;
  netBalance: number;
  totalLoss: number;
}

// ══════════════════════════════════════════
//  EXISTING GENERATORS (unchanged)
// ══════════════════════════════════════════

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

// ══════════════════════════════════════════
//  NEW GENERATORS — Finance Admin Page
// ══════════════════════════════════════════

/** Order Payment Rows — paid / unpaid / partial logic */
function generateOrderPaymentRows(): OrderPaymentRow[] {
  return dummyOrders.map((order) => {
    const successPayments = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "payment" && ph.status === "success"
    );
    const refunds = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "refund" && ph.status === "success"
    );
    const paid = successPayments.reduce((s, p) => s + p.amount, 0);
    const refundTotal = refunds.reduce((s, p) => s + p.amount, 0);

    const effectivePaid = Math.max(paid - refundTotal, 0);
    const due = Math.max(order.total - effectivePaid, 0);

    let status: OrderPaymentStatus;
    if (effectivePaid >= order.total) {
      status = "PAID";
    } else if (effectivePaid === 0) {
      status = "UNPAID";
    } else {
      status = "PARTIAL";
    }

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customer: order.shippingAddress.fullName,
      total: order.total,
      paid: effectivePaid,
      due,
      status,
      date: order.createdAt,
    };
  });
}

/** Returns & Refunds data */
function generateReturns(): ReturnEntry[] {
  const returns: ReturnEntry[] = [];

  // From real order data
  const returnedOrders = dummyOrders.filter(
    (o) =>
      o.orderStatus === OrderStatus.RETURNED ||
      o.orderStatus === OrderStatus.CANCELLED
  );

  returnedOrders.forEach((order) => {
    order.items.forEach((item, idx) => {
      const refundPayments = (order.paymentHistory ?? []).filter(
        (ph) => ph.type === "refund" && ph.status === "success"
      );
      const totalRefund = refundPayments.reduce((s, p) => s + p.amount, 0);
      const perItemRefund = Math.round(
        totalRefund / Math.max(order.items.length, 1)
      );

      returns.push({
        id: `ret-${order.id}-${idx}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        product: item.name,
        quantity: item.quantity,
        refundAmount: perItemRefund,
        returnReason:
          order.returnReason || order.cancelReason || "Customer requested",
        type: perItemRefund >= item.price * item.quantity ? "Full" : "Partial",
        status: "approved",
        date: order.updatedAt,
      });
    });
  });

  // Additional dummy returns
  returns.push(
    {
      id: "ret-extra-1",
      orderId: "ord-extra-1",
      orderNumber: "ORD-2026-015",
      product: "Men's Cotton T-Shirt",
      quantity: 2,
      refundAmount: 1200,
      returnReason: "Wrong size delivered",
      type: "Full",
      status: "pending",
      date: "2026-03-25T10:00:00Z",
    },
    {
      id: "ret-extra-2",
      orderId: "ord-extra-2",
      orderNumber: "ORD-2026-016",
      product: "Women's Handbag",
      quantity: 1,
      refundAmount: 800,
      returnReason: "Product damaged during shipping",
      type: "Partial",
      status: "approved",
      date: "2026-03-24T14:30:00Z",
    },
    {
      id: "ret-extra-3",
      orderId: "ord-extra-3",
      orderNumber: "ORD-2026-017",
      product: "Kids Sneakers",
      quantity: 1,
      refundAmount: 0,
      returnReason: "Changed mind after 30 days",
      type: "Full",
      status: "rejected",
      date: "2026-03-23T11:00:00Z",
    }
  );

  return returns.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Transaction Ledger — bank-statement style with running balance */
function generateLedger(): LedgerEntry[] {
  const entries: LedgerEntry[] = [];

  // Sales from orders
  dummyOrders.forEach((order) => {
    const successPayments = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "payment" && ph.status === "success"
    );
    successPayments.forEach((ph) => {
      entries.push({
        id: `led-sale-${ph.id}`,
        date: ph.date,
        type: "Sale",
        description: `Payment for ${order.orderNumber} — ${order.shippingAddress.fullName}`,
        debit: 0,
        credit: ph.amount,
        balance: 0,
      });
    });

    // Refunds
    const refundPayments = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "refund" && ph.status === "success"
    );
    refundPayments.forEach((ph) => {
      entries.push({
        id: `led-refund-${ph.id}`,
        date: ph.date,
        type: "Refund",
        description: `Refund for ${order.orderNumber} — ${order.shippingAddress.fullName}`,
        debit: ph.amount,
        credit: 0,
        balance: 0,
      });
    });
  });

  // Dummy expenses
  const expenses = [
    { date: "2026-03-22T08:00:00Z", desc: "Courier charges — Pathao delivery", amount: 2500 },
    { date: "2026-03-20T09:30:00Z", desc: "Packaging materials — boxes & tape", amount: 1800 },
    { date: "2026-03-18T10:00:00Z", desc: "SMS gateway — OTP & notifications", amount: 950 },
    { date: "2026-03-16T11:00:00Z", desc: "Warehouse rent — March installment", amount: 15000 },
    { date: "2026-03-14T12:00:00Z", desc: "Staff salary — March partial", amount: 25000 },
    { date: "2026-03-12T08:30:00Z", desc: "Courier charges — Sundorban delivery", amount: 1200 },
    { date: "2026-03-10T14:00:00Z", desc: "Product photography — March shoot", amount: 3500 },
    { date: "2026-03-08T16:00:00Z", desc: "Facebook ads — campaign week 1", amount: 8000 },
  ];

  expenses.forEach((exp, idx) => {
    entries.push({
      id: `led-exp-${idx}`,
      date: exp.date,
      type: "Expense",
      description: exp.desc,
      debit: exp.amount,
      credit: 0,
      balance: 0,
    });
  });

  // Sort chronologically
  entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate running balance
  let runningBalance = 0;
  entries.forEach((entry) => {
    runningBalance += entry.credit - entry.debit;
    entry.balance = runningBalance;
  });

  return entries;
}

/** Loss tracking */
function generateLosses(): LossEntry[] {
  const losses: LossEntry[] = [];

  // From returned / cancelled orders
  const lossOrders = dummyOrders.filter(
    (o) =>
      o.orderStatus === OrderStatus.RETURNED ||
      o.orderStatus === OrderStatus.CANCELLED
  );

  lossOrders.forEach((order) => {
    const refundPayments = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "refund" && ph.status === "success"
    );
    const totalRefund = refundPayments.reduce((s, p) => s + p.amount, 0);
    if (totalRefund > 0) {
      losses.push({
        id: `loss-${order.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        reason:
          order.orderStatus === OrderStatus.RETURNED
            ? "Product Return"
            : "Order Cancellation",
        lossAmount: totalRefund,
        date: order.updatedAt,
      });
    }
  });

  // Additional losses
  losses.push(
    {
      id: "loss-extra-1",
      orderId: "ord-dmg-1",
      orderNumber: "ORD-2026-018",
      reason: "Product Damaged in Warehouse",
      lossAmount: 3200,
      date: "2026-03-21T09:00:00Z",
    },
    {
      id: "loss-extra-2",
      orderId: "ord-dmg-2",
      orderNumber: "ORD-2026-019",
      reason: "Delivery Failed — 3 attempts",
      lossAmount: 450,
      date: "2026-03-19T15:00:00Z",
    },
    {
      id: "loss-extra-3",
      orderId: "ord-dmg-3",
      orderNumber: "ORD-2026-020",
      reason: "Product Damaged During Shipping",
      lossAmount: 1800,
      date: "2026-03-17T12:00:00Z",
    }
  );

  return losses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Per-order profit calculation */
function generateOrderProfits(): OrderProfitRow[] {
  return dummyOrders.map((order) => {
    const sellingPrice = order.total;
    // Simulate cost_price as 40-55% of selling price
    const productCost = Math.round(
      order.items.reduce(
        (s, item) =>
          s + item.price * item.quantity * (0.4 + Math.random() * 0.15),
        0
      )
    );
    const deliveryCost = order.shippingCost;
    const discount = order.discount;
    const refundPayments = (order.paymentHistory ?? []).filter(
      (ph) => ph.type === "refund" && ph.status === "success"
    );
    const refund = refundPayments.reduce((s, p) => s + p.amount, 0);

    const profit = sellingPrice - productCost - deliveryCost - discount - refund;

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customer: order.shippingAddress.fullName,
      sellingPrice,
      productCost,
      deliveryCost,
      discount,
      refund,
      profit,
      date: order.createdAt,
    };
  });
}

/** Overview stats for the finance dashboard */
function computeOverviewStats(): FinanceOverviewStats {
  const profits = generateOrderProfits();
  const payments = generateOrderPaymentRows();
  const returns = generateReturns();
  const losses = generateLosses();

  const totalRevenue = dummyOrders.reduce((s, o) => s + o.total, 0);
  const totalProfit = profits.reduce((s, p) => s + p.profit, 0);
  const totalOrders = dummyOrders.length;

  const paidTotal = payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.total, 0);
  const unpaidTotal = payments
    .filter((p) => p.status === "UNPAID" || p.status === "PARTIAL")
    .reduce((s, p) => s + p.due, 0);
  const returnTotal = returns
    .filter((r) => r.status === "approved")
    .reduce((s, r) => s + r.refundAmount, 0);
  const totalLoss = losses.reduce((s, l) => s + l.lossAmount, 0);

  const netBalance = totalRevenue - returnTotal;

  return {
    totalRevenue,
    totalProfit,
    totalOrders,
    paidTotal,
    unpaidTotal,
    returnTotal,
    netBalance,
    totalLoss,
  };
}

// ══════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════

// Existing
export const dailySales = generateDailySales();
export const financeStats = computeFinanceStats();
export const recentTransactions = generateTransactions();
export const paymentMethodBreakdown = computeMethodBreakdown();
export const weeklyRevenue = generateWeeklyRevenue();

// New
export const orderPaymentRows = generateOrderPaymentRows();
export const returnEntries = generateReturns();
export const ledgerEntries = generateLedger();
export const lossEntries = generateLosses();
export const orderProfits = generateOrderProfits();
export const overviewStats = computeOverviewStats();
