import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";
import { ProductStatus } from "@prisma/client";

// POST: Moderator sends approved designs to Super Admin
export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.moderation.sendToAdmin");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { designIds = [] } = body;

    let sent = 0;
    for (const id of designIds) {
      const design = await prisma.productDesign.findUnique({ where: { id } });
      if (design && design.status === ProductStatus.MODERATOR_APPROVED) {
        await prisma.productDesign.update({
          where: { id },
          data: { status: ProductStatus.SUPER_ADMIN_REVIEW },
        });
        await prisma.approvalHistory.create({
          data: {
            designId: id, fromStatus: ProductStatus.MODERATOR_APPROVED,
            toStatus: ProductStatus.SUPER_ADMIN_REVIEW,
            changedBy: user!.id, changedByRole: "BRANCH_MODERATOR",
            reason: "Sent to Super Admin for final approval",
          },
        });
        sent++;
      }
    }

    return success({ sent });
  } catch (e: unknown) {
    console.error("Send to admin error:", e);
    return error("Internal server error", 500);
  }
}
