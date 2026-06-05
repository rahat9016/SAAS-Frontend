// /api/branches/users
//   GET  → paginated list of branch users
//   POST → create a user inside a branch, assign an existing BRANCH role
//          via `roleId` (preferred) or an inline role (`roleName` + grants).
// Guard: super admin, or a user with access to the "users" resource.

import bcryptjs from "bcryptjs";
import { RoleScope } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  resolveTargetBranchId,
  validateGrantsAgainstScope,
  getActionKeys,
  type GrantInput,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getListParams(searchParams);
    const branchId = resolveTargetBranchId(admin, searchParams.get("branchId") ?? undefined);

    const where = {
      ...(branchId ? { branchId } : { branchId: { not: null } }),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [users, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          isSuperAdmin: true,
          branchId: true,
          role: { select: { id: true, name: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return rbacPaginated(users, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list branch users error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { name, email, password, roleId, roleName } = body;
    const requested: GrantInput[] = body.permissions ?? [];

    if (!email || !password) {
      return rbacError("email and password are required", 400);
    }
    if (!roleId && !roleName) {
      return rbacError("provide roleId (existing role) or roleName (inline)", 400);
    }

    const branchId = resolveTargetBranchId(admin, body.branchId);
    if (!branchId) return rbacError("No branch context", 400);

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { branchPermissions: true },
    });
    if (!branch) return rbacError("Branch not found", 404);

    // Path A: assign an existing branch role.
    let resolvedRoleId: string;
    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role || role.branchId !== branch.id) {
        return rbacError("Role not found in this branch", 404);
      }
      resolvedRoleId = role.id;
    } else {
      // Path B: create an inline role from validated grants.
      const actionKeys = await getActionKeys();
      const { grants, error } = validateGrantsAgainstScope(
        branch.branchPermissions,
        requested,
        actionKeys,
      );
      if (error) return rbacError(error, 403);

      const role = await prisma.role.create({
        data: {
          name: `${branch.code} - ${roleName}`,
          scope: RoleScope.BRANCH,
          branchId: branch.id,
          createdBy: admin.id,
          resourcePermissions: { create: grants },
        },
      });
      resolvedRoleId = role.id;
    }

    const hashed = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name ?? email,
        email,
        password: hashed,
        branchId: branch.id,
        organizationId: branch.organizationId,
        roleId: resolvedRoleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        branchId: true,
        roleId: true,
      },
    });

    return rbacSuccess(user, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A user with this email, or that role name, already exists", 409);
    }
    console.error("create branch user error:", e);
    return rbacError("Internal server error", 500);
  }
}
