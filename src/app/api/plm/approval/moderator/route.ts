import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error, isBranchScoped } from "@/src/lib/plm-api";
import { ProductStatus } from "@prisma/client";

// GET: Designs pending moderator review
export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.moderation.review");
    if (errorResponse) return errorResponse;

    const where: Record<string, unknown> = {
      status: { in: [ProductStatus.DESIGN_SUBMITTED, ProductStatus.MODERATOR_REVIEW, ProductStatus.SUPER_ADMIN_REJECTED] },
    };

    // ABAC: branch-scoped moderator sees only their branch
    if (isBranchScoped(user!.roles) && user!.branchId) {
      where.branchId = user!.branchId;
    }

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
      images: d.images, status: d.status, rejectionReason: d.rejectionReason,
      designerId: d.designer.id, designerName: d.designer.name,
      branchId: d.branch.id, branchName: d.branch.name,
      createdAt: d.createdAt.toISOString(),
    })));
  } catch (e: unknown) {
    console.error("Moderator pending error:", e);
    return error("Internal server error", 500);
  }
}

// POST: Moderator batch approve/reject
export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.moderation.approve");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { approvedIds = [], rejectedIds = [], rejectedReasons = {} } = body;
    const now = new Date();

    // Approve selected
    for (const id of approvedIds) {
      await prisma.productDesign.update({
        where: { id },
        data: { status: ProductStatus.MODERATOR_APPROVED },
      });
      await prisma.approvalHistory.create({
        data: {
          designId: id, fromStatus: ProductStatus.MODERATOR_REVIEW,
          toStatus: ProductStatus.MODERATOR_APPROVED,
          changedBy: user!.id, changedByRole: "BRANCH_MODERATOR",
        },
      });
      await prisma.approval.create({
        data: { designId: id, userId: user!.id, decision: "APPROVED", level: "MODERATOR" },
      });
    }

    // Reject selected
    for (const id of rejectedIds) {
      const reason = rejectedReasons[id] || "Rejected by moderator";
      await prisma.productDesign.update({
        where: { id },
        data: { status: ProductStatus.REDESIGN_REQUIRED, rejectionReason: reason },
      });
      await prisma.approvalHistory.create({
        data: {
          designId: id, fromStatus: ProductStatus.MODERATOR_REVIEW,
          toStatus: ProductStatus.REDESIGN_REQUIRED,
          changedBy: user!.id, changedByRole: "BRANCH_MODERATOR", reason,
        },
      });
      await prisma.approval.create({
        data: { designId: id, userId: user!.id, decision: "REJECTED", reason, level: "MODERATOR" },
      });
    }

    return success({ approved: approvedIds.length, rejected: rejectedIds.length });
  } catch (e: unknown) {
    console.error("Moderator batch error:", e);
    return error("Internal server error", 500);
  }
}
