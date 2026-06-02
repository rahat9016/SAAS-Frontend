import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.view");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const material = await prisma.rawMaterial.findUnique({
      where: { id },
      include: { allocations: { orderBy: { allocatedAt: "desc" }, take: 20 } },
    });
    if (!material) return error("Material not found", 404);
    return success(material);
  } catch (e: unknown) {
    console.error("Material detail error:", e);
    return error("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.manage");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.rawMaterial.findUnique({ where: { id } });
    if (!existing) return error("Material not found", 404);

    const body = await request.json();
    const newTotalStock = body.totalStock !== undefined ? body.totalStock : existing.totalStock;

    const material = await prisma.rawMaterial.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.unit !== undefined && { unit: body.unit }),
        ...(body.totalStock !== undefined && {
          totalStock: newTotalStock,
          availableStock: newTotalStock - existing.allocatedStock,
          lastRestocked: new Date(),
        }),
        ...(body.reorderLevel !== undefined && { reorderLevel: body.reorderLevel }),
        ...(body.unitCost !== undefined && { unitCost: body.unitCost }),
      },
    });

    return success(material);
  } catch (e: unknown) {
    console.error("Material update error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.manage");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.rawMaterial.findUnique({ where: { id } });
    if (!existing) return error("Material not found", 404);

    await prisma.rawMaterial.delete({ where: { id } });
    return success({ message: "Material deleted" });
  } catch (e: unknown) {
    console.error("Material delete error:", e);
    return error("Internal server error", 500);
  }
}
