import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error, isBranchScoped } from "@/src/lib/plm-api";

export async function GET(request: Request) {
  try {
    const { user, errorResponse } = await requirePermission(request, "plm.dashboard.view");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    let branchId = searchParams.get("branchId") || "";

    // ABAC: branch-scoped users can only see their own branch stats
    if (isBranchScoped(user!.roles) && user!.branchId) {
      branchId = user!.branchId;
    }

    const branchWhere = branchId ? { branchId } : {};

    const [
      totalDesigns, conceptCount, inProgressCount, submittedCount,
      moderatorReviewCount, adminReviewCount, approvedCount, inProductionCount,
      totalMaterials, lowStockCount, totalBranches, totalUsers,
    ] = await Promise.all([
      prisma.productDesign.count({ where: branchWhere }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "CONCEPT" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "DESIGN_IN_PROGRESS" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "DESIGN_SUBMITTED" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "MODERATOR_REVIEW" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "SUPER_ADMIN_REVIEW" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "SUPER_ADMIN_APPROVED" } }),
      prisma.productDesign.count({ where: { ...branchWhere, status: "IN_PRODUCTION" } }),
      prisma.rawMaterial.count(),
      prisma.rawMaterial.count({ where: { availableStock: { lte: 50 } } }),
      prisma.branch.count(),
      prisma.user.count(),
    ]);

    return success({
      totalDesigns, conceptCount, inProgressCount, submittedCount,
      moderatorReviewCount, adminReviewCount, approvedCount, inProductionCount,
      totalMaterials, lowStockCount, totalBranches, totalUsers,
    });
  } catch (e: unknown) {
    console.error("Dashboard error:", e);
    return error("Internal server error", 500);
  }
}

