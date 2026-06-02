import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, paginated, error, getPaginationParams } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.branch.view");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search, status } = getPaginationParams(searchParams);

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status === "ACTIVE") where.isActive = true;
    if (status === "INACTIVE") where.isActive = false;

    // ABAC: org-scoped
    if (user!.organizationId) where.organizationId = user!.organizationId;

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [data, totalItems] = await Promise.all([
      prisma.branch.findMany({
        where, skip, take,
        include: { organization: { select: { id: true, name: true } }, _count: { select: { designs: true, users: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.branch.count({ where }),
    ]);

    return paginated(data, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e: unknown) {
    console.error("Branch list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.branch.create");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, code, location, isActive, organizationId } = body;

    if (!name || !code || !organizationId) {
      return error("name, code, and organizationId are required", 400);
    }

    const branch = await prisma.branch.create({
      data: { name, code, location: location || "", isActive: isActive ?? true, organizationId },
    });

    return success(branch);
  } catch (e: unknown) {
    console.error("Branch create error:", e);
    return error("Internal server error", 500);
  }
}
