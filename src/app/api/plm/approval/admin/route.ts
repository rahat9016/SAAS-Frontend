import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";
import { ProductStatus } from "@prisma/client";

// GET: Designs pending Super Admin review
export async function GET(request: Request) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.approval.decide");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId") || "";

    const where: Record<string, unknown> = { status: ProductStatus.SUPER_ADMIN_REVIEW };
    if (branchId) where.branchId = branchId;

    const designs = await prisma.productDesign.findMany({
      where,
      include: {
        designer: { select: { id: true, name: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(designs.map((d) => ({
      id: d.id, name: d.name, description: d.description, category: d.category,
      images: d.images, status: d.status,
      designerName: d.designer.name, branchId: d.branch.id, branchName: d.branch.name,
      createdAt: d.createdAt.toISOString(),
    })));
  } catch (e: unknown) {
    console.error("Admin pending error:", e);
    return error("Internal server error", 500);
  }
}

// POST: Super Admin batch decision (approve some, reject others with reasons)
export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.approval.decide");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { approvedIds = [], rejectedIds = [], rejectedReasons = {} } = body;

    // Approve selected
    for (const id of approvedIds) {
      await prisma.productDesign.update({
        where: { id },
        data: { status: ProductStatus.SUPER_ADMIN_APPROVED, rejectionReason: null },
      });
      await prisma.approvalHistory.create({
        data: {
          designId: id, fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
          toStatus: ProductStatus.SUPER_ADMIN_APPROVED,
          changedBy: user!.id, changedByRole: "SUPER_ADMIN",
        },
      });
      await prisma.approval.create({
        data: { designId: id, userId: user!.id, decision: "APPROVED", level: "SUPER_ADMIN" },
      });
    }

    // Reject selected (return to moderator with reasons)
    for (const id of rejectedIds) {
      const reason = rejectedReasons[id] || "Not selected by admin";
      await prisma.productDesign.update({
        where: { id },
        data: { status: ProductStatus.SUPER_ADMIN_REJECTED, rejectionReason: reason },
      });
      await prisma.approvalHistory.create({
        data: {
          designId: id, fromStatus: ProductStatus.SUPER_ADMIN_REVIEW,
          toStatus: ProductStatus.SUPER_ADMIN_REJECTED,
          changedBy: user!.id, changedByRole: "SUPER_ADMIN", reason,
        },
      });
      await prisma.approval.create({
        data: { designId: id, userId: user!.id, decision: "REJECTED", reason, level: "SUPER_ADMIN" },
      });
    }

    return success({ approved: approvedIds.length, rejected: rejectedIds.length });
  } catch (e: unknown) {
    console.error("Admin batch decision error:", e);
    return error("Internal server error", 500);
  }
}
