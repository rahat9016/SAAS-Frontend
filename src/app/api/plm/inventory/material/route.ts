import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, paginated, error, getPaginationParams } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.view");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getPaginationParams(searchParams);
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [data, totalItems] = await Promise.all([
      prisma.rawMaterial.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      prisma.rawMaterial.count({ where }),
    ]);

    return paginated(data, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e: unknown) {
    console.error("Material list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.inventory.manage");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, sku, category, unit, totalStock, reorderLevel, unitCost } = body;
    if (!name || !sku) return error("name and sku are required", 400);

    const material = await prisma.rawMaterial.create({
      data: {
        name, sku,
        category: category || "",
        unit: unit || "pcs",
        totalStock: totalStock || 0,
        availableStock: totalStock || 0,
        reorderLevel: reorderLevel || 0,
        unitCost: unitCost || 0,
      },
    });

    return success(material);
  } catch (e: unknown) {
    console.error("Material create error:", e);
    return error("Internal server error", 500);
  }
}
