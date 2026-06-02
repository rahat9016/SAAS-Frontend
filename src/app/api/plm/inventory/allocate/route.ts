import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";

// GET: List all raw material allocations
export async function GET(request: Request) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.view");
    if (errorResponse) return errorResponse;

    const allocations = await prisma.rawMaterialAllocation.findMany({
      orderBy: { allocatedAt: "desc" },
    });

    return success(allocations);
  } catch (e: unknown) {
    console.error("List allocations error:", e);
    return error("Internal server error", 500);
  }
}

// POST: Allocate raw material to a production worksheet
export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.inventory.manage");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { materialId, worksheetId, designName, quantity, unit } = body;
    if (!materialId || !worksheetId || !quantity) {
      return error("materialId, worksheetId, and quantity are required", 400);
    }

    const material = await prisma.rawMaterial.findUnique({ where: { id: materialId } });
    if (!material) return error("Material not found", 404);

    if (material.availableStock < quantity) {
      return error(`Insufficient stock. Available: ${material.availableStock} ${material.unit}`, 400);
    }

    // Create allocation
    const allocation = await prisma.rawMaterialAllocation.create({
      data: {
        materialId, worksheetId,
        designName: designName || "Unknown",
        quantity, unit: unit || material.unit,
        allocatedBy: user!.id,
      },
    });

    // Update stock
    await prisma.rawMaterial.update({
      where: { id: materialId },
      data: {
        allocatedStock: { increment: quantity },
        availableStock: { decrement: quantity },
      },
    });

    return success(allocation);
  } catch (e: unknown) {
    console.error("Allocate error:", e);
    return error("Internal server error", 500);
  }
}
