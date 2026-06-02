import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, paginated, error, getPaginationParams, isBranchScoped } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.production.view");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search, status } = getPaginationParams(searchParams);

    const where: Record<string, unknown> = {};
    if (search) { where.OR = [{ design: { name: { contains: search, mode: "insensitive" } } }]; }
    if (status) where.status = status;
    if (isBranchScoped(user!.roles) && user!.branchId) where.branchId = user!.branchId;

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [data, totalItems] = await Promise.all([
      prisma.productionWorksheet.findMany({
        where, skip, take,
        include: {
          design: { select: { id: true, name: true, category: true } },
          branch: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.productionWorksheet.count({ where }),
    ]);

    return paginated(data, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e: unknown) {
    console.error("Worksheet list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.production.advance");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { designId, assignedTo, estimatedCompletionDate, notes, materials } = body;
    if (!designId || !assignedTo || !estimatedCompletionDate) {
      return error("designId, assignedTo, and estimatedCompletionDate are required", 400);
    }

    const design = await prisma.productDesign.findUnique({ where: { id: designId } });
    if (!design) return error("Design not found", 404);

    const worksheet = await prisma.productionWorksheet.create({
      data: {
        designId,
        branchId: design.branchId,
        assignedTo,
        status: design.status,
        estimatedCompletionDate: new Date(estimatedCompletionDate),
        notes: notes || "",
        materials: materials || [],
      },
    });

    return success(worksheet);
  } catch (e: unknown) {
    console.error("Worksheet create error:", e);
    return error("Internal server error", 500);
  }
}
