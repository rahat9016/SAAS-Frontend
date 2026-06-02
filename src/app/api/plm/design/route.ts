import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, paginated, error, getPaginationParams, isBranchScoped } from "@/src/lib/plm-api";
import { ProductStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.design.view");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search, status } = getPaginationParams(searchParams);
    const branchId = searchParams.get("branchId") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status && Object.values(ProductStatus).includes(status as ProductStatus)) {
      where.status = status;
    }

    // ABAC: branch-scoped users only see their branch
    if (isBranchScoped(user!.roles) && user!.branchId) {
      where.branchId = user!.branchId;
    } else if (branchId) {
      where.branchId = branchId;
    }

    // ABAC: design team only sees own designs
    if (user!.roles.includes("DESIGN_TEAM") && !user!.roles.includes("BRANCH_MODERATOR") && !user!.roles.includes("SUPER_ADMIN")) {
      where.designerId = user!.id;
    }

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [data, totalItems] = await Promise.all([
      prisma.productDesign.findMany({
        where, skip, take,
        include: {
          designer: { select: { id: true, name: true, email: true } },
          branch: { select: { id: true, name: true, code: true } },
          _count: { select: { approvals: true, statusHistory: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.productDesign.count({ where }),
    ]);

    // Map to list items matching frontend IDesignListItem
    const mapped = data.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      category: d.category,
      images: d.images,
      status: d.status,
      rejectionReason: d.rejectionReason,
      designerId: d.designer.id,
      designerName: d.designer.name,
      branchId: d.branch.id,
      branchName: d.branch.name,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return paginated(mapped, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e: unknown) {
    console.error("Design list error:", e);
    return error("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.design.create");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, description, category, images, branchId } = body;

    if (!name) return error("name is required", 400);

    const targetBranch = branchId || user!.branchId;
    if (!targetBranch) return error("branchId is required", 400);

    const design = await prisma.productDesign.create({
      data: {
        name,
        description: description || "",
        category: category || "",
        images: images || [],
        status: ProductStatus.CONCEPT,
        designerId: user!.id,
        branchId: targetBranch,
      },
    });

    // Create initial history entry
    await prisma.approvalHistory.create({
      data: {
        designId: design.id,
        fromStatus: null,
        toStatus: ProductStatus.CONCEPT,
        changedBy: user!.id,
        changedByRole: user!.roles[0] || "DESIGN_TEAM",
        reason: "Design created",
      },
    });

    return success(design);
  } catch (e: unknown) {
    console.error("Design create error:", e);
    return error("Internal server error", 500);
  }
}
