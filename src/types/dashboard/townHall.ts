// ── Town Hall Board ──────────────────────────────────────

export interface TownHallQuarterRow {
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  totalSales: number;
  totalOrderNumber: number;
  totalCustomer: number;
  locationZone: string;
  completedPayment: number;
  pendingPayment: number;
  taxAmount: number;
}

export interface TownHallSummary {
  netRevenue: number;
  year: number;
  netProfit: number;
  month: string;
}

// ── Magic Board ──────────────────────────────────────────

export interface MagicBoardRow {
  week: string;
  weeklySales: number;
  fixedCost: number;
  overheadCost: number;
  maintenanceCost: number;
  deliveryCost: number;
  netCost: number;
  weeklyProfit: number;
}

// ── Notice Board ─────────────────────────────────────────

export interface NoticeBoardRow {
  monthly: string;
  success: number;
  failure: number;
}

// ── Article Info ─────────────────────────────────────────

export interface ArticleInfoRow {
  intendedMonth: string;
  fit: string;
  supplier: string;
  qualityInspection: string;
  publishingDate: string;
  duration: string;
  numberOfViewers: number;
  retailPrice: number;
  fob: number;
  successAmount: number;
  failure: number;
  claim: number;
  gpa5: string;
}

export interface ArticleInfo {
  articleNumber: string;
  rows: ArticleInfoRow[];
}

// ── Product Info ─────────────────────────────────────────

export type ProductLifecycle = "Active" | "Phase Out" | "New";

export interface ProductInfoRow {
  location: string;
  fit: string;
  size: string;
  color: string;
  issues: string;
  supplier: string;
  consumingDuration: string;
  articleNr: string;
  deliveryCost: number;
  branch: string;
  revenue: number;
  totalCost: number;
  status: "On Track" | "Delayed" | "Blocked";
  lifecycle: ProductLifecycle;
  note: string;
}

export interface ProductInfo {
  poNumber: string;
  rows: ProductInfoRow[];
}

// ── Order Pipeline (bottom board) ────────────────────────

/** done = green, progress = amber, blocked = red, idle = not started */
export type PipelineState = "done" | "progress" | "blocked" | "idle";

export type PipelineStage =
  | "address"
  | "sample"
  | "store"
  | "package"
  | "shipped"
  | "central"
  | "transport"
  | "awb"
  | "customer"
  | "money"
  | "return"
  | "cost"
  | "stow"
  | "payBack";

export type OrderPriority = "Fast Track" | "Normal" | "Low";

/** Flat row — every stage is a top level key so DataTable can address it */
export type OrderPipelineRow = Record<PipelineStage, PipelineState> & {
  branch: string;
  date: string;
  dailyOrderList: string;
  priority: OrderPriority;
};
