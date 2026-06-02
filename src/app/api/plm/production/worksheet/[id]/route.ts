import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error, isValidTransition } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";
import { ProductStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.production.view");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const ws = await prisma.productionWorksheet.findUnique({
      where: { id },
      include: {
        design: { select: { id: true, name: true, category: true, status: true } },
        branch: { select: { id: true, name: true } },
      },
    });
    if (!ws) return error("Worksheet not found", 404);
    return success(ws);
  } catch (e: unknown) {
    console.error("Worksheet detail error:", e);
    return error("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.production.advance");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const ws = await prisma.productionWorksheet.findUnique({ where: { id } });
    if (!ws) return error("Worksheet not found", 404);

    const body = await request.json();

    if (body.status && body.status !== ws.status) {
      if (!isValidTransition(ws.status, body.status as ProductStatus)) {
        return error(`Invalid transition: ${ws.status} → ${body.status}`, 400);
      }
      // Also update the design status
      await prisma.productDesign.update({
        where: { id: ws.designId },
        data: { status: body.status as ProductStatus },
      });
      await prisma.approvalHistory.create({
        data: {
          designId: ws.designId, fromStatus: ws.status,
          toStatus: body.status as ProductStatus,
          changedBy: user!.id, changedByRole: user!.roles[0] || "PRODUCTION_TEAM",
        },
      });
    }

    const updated = await prisma.productionWorksheet.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status as ProductStatus }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.actualCompletionDate && { actualCompletionDate: new Date(body.actualCompletionDate) }),
      },
    });

    return success(updated);
  } catch (e: unknown) {
    console.error("Worksheet update error:", e);
    return error("Internal server error", 500);
  }
}
