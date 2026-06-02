import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ designId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.design.view");
    if (errorResponse) return errorResponse;
    const { designId } = await params;

    const history = await prisma.approvalHistory.findMany({
      where: { designId },
      include: { changedByUser: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return success(history.map((h) => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      changedBy: h.changedByUser.name,
      changedByRole: h.changedByRole,
      reason: h.reason,
      timestamp: h.createdAt.toISOString(),
    })));
  } catch (e: unknown) {
    console.error("Approval history error:", e);
    return error("Internal server error", 500);
  }
}
