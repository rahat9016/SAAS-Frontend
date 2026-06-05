// /api/super-admin/branches — Super Admin only.
//   GET  → paginated list of branches with their permission scope + counts
//   POST → create a Branch + its base scope (BranchPermission), the ceiling
//          for every BRANCH-scope role created inside it.

import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  getActionKeys,
} from "@/src/lib/rbac";
import { RESOURCES, sanitizeActions } from "@/src/config/rbac";

interface ScopeInput {
  resource: string;
  actions: string[];
}

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { page, limit, search } = getListParams(new URL(request.url).searchParams);
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { code: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [branches, totalItems] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take,
        include: {
          branchPermissions: true,
          organization: { select: { id: true, name: true, code: true } },
          _count: { select: { users: true, roles: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.branch.count({ where }),
    ]);

    return rbacPaginated(branches, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list branches error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, code, location, organizationId } = body;
    const permissions: ScopeInput[] = body.permissions ?? [];

    if (!name || !code || !organizationId) {
      return rbacError("name, code, and organizationId are required", 400);
    }

    const actionKeys = await getActionKeys();
    const cleanScope = permissions
      .filter((p) => (RESOURCES as readonly string[]).includes(p.resource))
      .map((p) => ({
        resource: p.resource,
        actions: sanitizeActions(p.actions ?? [], actionKeys),
      }));

    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        location: location ?? "",
        organizationId,
        branchPermissions: { create: cleanScope },
      },
      include: { branchPermissions: true },
    });

    return rbacSuccess(branch, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A branch with this code already exists", 409);
    }
    console.error("create branch error:", e);
    return rbacError("Internal server error", 500);
  }
}
