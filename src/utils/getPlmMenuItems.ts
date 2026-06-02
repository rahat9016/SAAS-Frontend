import {
  Palette,
  ClipboardCheck,
  ShieldCheck,
  Factory,
  Warehouse,
  LayoutDashboard,
  GitBranch,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PlmPermission } from "@/src/types/plm/plmPermissions";

export interface PlmMenuItem {
  segment?: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  matchRoutes?: string[];
  children?: { label: string; href: string; matchRoutes?: string[] }[];
  /** If set, this item is only shown when the user has this permission */
  requiredPermission?: PlmPermission;
}

/**
 * Returns PLM menu items filtered by the user's dynamic permissions
 * fetched from the backend API (supports custom roles).
 */
export function getPlmMenuItems(permissions: string[]): PlmMenuItem[] {
  const allItems: PlmMenuItem[] = [
    // ─── Super Admin ─────────────────────────────────────────────
    {
      label: "PLM Dashboard",
      icon: LayoutDashboard,
      href: "/admin/plm",
      requiredPermission: "plm.dashboard.view",
    },
    {
      segment: "Product Lifecycle",
      label: "Approvals",
      icon: ShieldCheck,
      requiredPermission: "plm.approval.decide",
      children: [
        { label: "Approval Panel", href: "/admin/plm/approvals" },
        { label: "All Branches", href: "/admin/plm/branches" },
      ],
    },

    // ─── Branch Moderator ────────────────────────────────────────
    {
      segment: "Product Lifecycle",
      label: "Moderation",
      icon: ClipboardCheck,
      requiredPermission: "plm.moderation.review",
      children: [
        { label: "Review Submissions", href: "/admin/plm/moderation" },
        {
          label: "All Designs",
          href: "/admin/plm/designs",
          matchRoutes: ["/admin/plm/designs", "/admin/plm/designs/create"],
        },
      ],
    },

    // ─── Design Team ─────────────────────────────────────────────
    {
      segment: "Product Lifecycle",
      label: "Designs",
      icon: Palette,
      requiredPermission: "plm.design.create",
      children: [
        { label: "My Designs", href: "/admin/plm/designs" },
        { label: "Create Design", href: "/admin/plm/designs/create" },
      ],
    },

    // ─── Production Team ─────────────────────────────────────────
    {
      segment: "Product Lifecycle",
      label: "Production",
      icon: Factory,
      requiredPermission: "plm.production.view",
      children: [
        { label: "Production Queue", href: "/admin/plm/production" },
      ],
    },

    // ─── Inventory Team ──────────────────────────────────────────
    {
      segment: "Product Lifecycle",
      label: "Inventory",
      icon: Warehouse,
      requiredPermission: "plm.inventory.view",
      children: [
        { label: "Raw Materials", href: "/admin/plm/inventory" },
      ],
    },

    // ─── Super Admin: Role Management ────────────────────────────
    {
      segment: "Access Control",
      label: "PLM Roles",
      icon: Shield,
      requiredPermission: "plm.branch.create",
      children: [
        { label: "Manage Roles", href: "/admin/plm/roles" },
        { label: "User Assignments", href: "/admin/plm/role-assignments" },
      ],
    },

    // ─── Shared: visible to all with design.view ─────────────────
    {
      segment: "Product Lifecycle",
      label: "Pipeline",
      icon: GitBranch,
      href: "/admin/plm/designs",
      matchRoutes: ["/admin/plm/designs"],
      requiredPermission: "plm.design.view",
    },
  ];

  // Filter by dynamic permissions from the API
  return allItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return permissions.includes(item.requiredPermission);
  });
}
