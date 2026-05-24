import { ProductStatus, PlmRole } from "@/src/types/plm/productLifecycleTypes";

// ─── Human-Readable Status Labels ───────────────────────────────────
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.CONCEPT]: "Concept",
  [ProductStatus.DESIGN_IN_PROGRESS]: "Design In Progress",
  [ProductStatus.DESIGN_SUBMITTED]: "Design Submitted",
  [ProductStatus.MODERATOR_REVIEW]: "Moderator Review",
  [ProductStatus.MODERATOR_APPROVED]: "Moderator Approved",
  [ProductStatus.SUPER_ADMIN_REVIEW]: "Super Admin Review",
  [ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED]: "Partially Approved",
  [ProductStatus.SUPER_ADMIN_APPROVED]: "Approved",
  [ProductStatus.SUPER_ADMIN_REJECTED]: "Rejected",
  [ProductStatus.REDESIGN_REQUIRED]: "Redesign Required",
  [ProductStatus.SAMPLE_DEVELOPMENT]: "Sample Development",
  [ProductStatus.RAW_MATERIAL_ALLOCATED]: "Material Allocated",
  [ProductStatus.PRODUCTION_WORKSHEET_CREATED]: "Worksheet Created",
  [ProductStatus.READY_FOR_PRODUCTION]: "Ready for Production",
  [ProductStatus.IN_PRODUCTION]: "In Production",
  [ProductStatus.QUALITY_CHECK]: "Quality Check",
  [ProductStatus.READY_FOR_BRANCH]: "Ready for Branch",
  [ProductStatus.LIVE_FOR_SALE]: "Live for Sale",
};

// ─── Status Color Classes (badge bg + text) ─────────────────────────
export const PRODUCT_STATUS_COLORS: Record<
  ProductStatus,
  { bg: string; text: string; dot: string }
> = {
  [ProductStatus.CONCEPT]: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  [ProductStatus.DESIGN_IN_PROGRESS]: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  [ProductStatus.DESIGN_SUBMITTED]: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  [ProductStatus.MODERATOR_REVIEW]: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  [ProductStatus.MODERATOR_APPROVED]: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  [ProductStatus.SUPER_ADMIN_REVIEW]: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  [ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED]: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  [ProductStatus.SUPER_ADMIN_APPROVED]: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  [ProductStatus.SUPER_ADMIN_REJECTED]: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  [ProductStatus.REDESIGN_REQUIRED]: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-400",
  },
  [ProductStatus.SAMPLE_DEVELOPMENT]: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
  },
  [ProductStatus.RAW_MATERIAL_ALLOCATED]: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
  },
  [ProductStatus.PRODUCTION_WORKSHEET_CREATED]: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  [ProductStatus.READY_FOR_PRODUCTION]: {
    bg: "bg-lime-50",
    text: "text-lime-700",
    dot: "bg-lime-500",
  },
  [ProductStatus.IN_PRODUCTION]: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  [ProductStatus.QUALITY_CHECK]: {
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
    dot: "bg-fuchsia-400",
  },
  [ProductStatus.READY_FOR_BRANCH]: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  [ProductStatus.LIVE_FOR_SALE]: {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-600",
  },
};

// ─── Role Labels ────────────────────────────────────────────────────
export const PLM_ROLE_LABELS: Record<PlmRole, string> = {
  SUPER_ADMIN: "Super Admin",
  BRANCH_MODERATOR: "Branch Moderator",
  DESIGN_TEAM: "Design Team",
  PRODUCTION_TEAM: "Production Team",
  INVENTORY_TEAM: "Inventory Team",
};

// ─── Role Colors ────────────────────────────────────────────────────
export const PLM_ROLE_COLORS: Record<PlmRole, string> = {
  SUPER_ADMIN: "bg-gradient-to-r from-violet-600 to-indigo-600",
  BRANCH_MODERATOR: "bg-gradient-to-r from-blue-600 to-cyan-600",
  DESIGN_TEAM: "bg-gradient-to-r from-pink-600 to-rose-600",
  PRODUCTION_TEAM: "bg-gradient-to-r from-amber-600 to-orange-600",
  INVENTORY_TEAM: "bg-gradient-to-r from-emerald-600 to-teal-600",
};

// ─── Design Categories ─────────────────────────────────────────────
export const DESIGN_CATEGORIES = [
  { label: "Apparel", value: "apparel" },
  { label: "Footwear", value: "footwear" },
  { label: "Accessories", value: "accessories" },
  { label: "Home Textile", value: "home-textile" },
  { label: "Bags & Luggage", value: "bags-luggage" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Electronics Casing", value: "electronics-casing" },
  { label: "Furniture", value: "furniture" },
];

// ─── Material Categories ────────────────────────────────────────────
export const MATERIAL_CATEGORIES = [
  { label: "Fabric", value: "fabric" },
  { label: "Thread", value: "thread" },
  { label: "Button", value: "button" },
  { label: "Zipper", value: "zipper" },
  { label: "Dye", value: "dye" },
  { label: "Packaging", value: "packaging" },
  { label: "Metal Hardware", value: "metal-hardware" },
  { label: "Leather", value: "leather" },
  { label: "Adhesive", value: "adhesive" },
];

// ─── Material Units ─────────────────────────────────────────────────
export const MATERIAL_UNITS = [
  { label: "Meters", value: "m" },
  { label: "Kilograms", value: "kg" },
  { label: "Pieces", value: "pcs" },
  { label: "Liters", value: "L" },
  { label: "Rolls", value: "rolls" },
  { label: "Yards", value: "yards" },
  { label: "Sheets", value: "sheets" },
];
