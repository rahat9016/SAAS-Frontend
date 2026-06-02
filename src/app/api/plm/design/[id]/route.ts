import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error, isValidTransition } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";
import { ProductStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.design.view");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const design = await prisma.productDesign.findUnique({
      where: { id },
      include: {
        designer: { select: { id: true, name: true, email: true } },
        branch: { select: { id: true, name: true, code: true } },
        statusHistory: { orderBy: { createdAt: "asc" }, include: { changedByUser: { select: { name: true } } } },
        approvals: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
        revisions: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!design) return error("Design not found", 404);

    return success({
      ...design,
      designerName: design.designer.name,
      branchName: design.branch.name,
      createdAt: design.createdAt.toISOString(),
      updatedAt: design.updatedAt.toISOString(),
    });
  } catch (e: unknown) {
    console.error("Design detail error:", e);
    return error("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.design.create", "plm.design.advance");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.productDesign.findUnique({ where: { id } });
    if (!existing) return error("Design not found", 404);

    const body = await request.json();

    // If status change requested, validate transition
    if (body.status && body.status !== existing.status) {
      if (!isValidTransition(existing.status, body.status as ProductStatus)) {
        return error(`Invalid status transition: ${existing.status} → ${body.status}`, 400);
      }

      // Create history entry
      await prisma.approvalHistory.create({
        data: {
          designId: id,
          fromStatus: existing.status,
          toStatus: body.status as ProductStatus,
          changedBy: user!.id,
          changedByRole: user!.roles[0] || "DESIGN_TEAM",
          reason: body.reason || undefined,
        },
      });
    }

    const design = await prisma.productDesign.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.status !== undefined && { status: body.status as ProductStatus }),
        ...(body.rejectionReason !== undefined && { rejectionReason: body.rejectionReason }),
        ...(body.moderatorNotes !== undefined && { moderatorNotes: body.moderatorNotes }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
      },
    });

    return success(design);
  } catch (e: unknown) {
    console.error("Design update error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.design.create");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.productDesign.findUnique({ where: { id } });
    if (!existing) return error("Design not found", 404);

    // Only allow deleting CONCEPT or DESIGN_IN_PROGRESS
    if (existing.status !== ProductStatus.CONCEPT && existing.status !== ProductStatus.DESIGN_IN_PROGRESS) {
      return error("Can only delete designs in CONCEPT or DESIGN_IN_PROGRESS status", 400);
    }

    await prisma.productDesign.delete({ where: { id } });
    return success({ message: "Design deleted" });
  } catch (e: unknown) {
    console.error("Design delete error:", e);
    return error("Internal server error", 500);
  }
}
