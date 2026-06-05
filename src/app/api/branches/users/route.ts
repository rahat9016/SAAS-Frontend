// POST /api/branches/users
// Branch Admin (or Super Admin) creates a user inside a branch.
//
// Roles are dynamic: prefer assigning an EXISTING branch role via `roleId`
// (managed at /api/branches/roles). For convenience an inline role may
// still be created by passing `roleName` + `permissions` — those grants
// are validated as a SUBSET of the branch's allowed scope (top-down RBAC).

import bcryptjs from "bcryptjs";
import { GlobalRole } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireGlobalRole,
  rbacError,
  rbacSuccess,
  resolveTargetBranchId,
  validateGrantsAgainstScope,
  type GrantInput,
} from "@/src/lib/rbac";

// GET — list branch users (a Branch Admin sees only their own branch).
export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const branchId = resolveTargetBranchId(
      admin,
      searchParams.get("branchId") ?? undefined,
    );

    const where =
      admin.globalRole === GlobalRole.SUPER_ADMIN
        ? branchId
          ? { branchId }
          : { globalRole: GlobalRole.BRANCH_USER }
        : { branchId: branchId ?? "__none__" };

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        globalRole: true,
        branchId: true,
        role: { select: { id: true, name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return rbacSuccess(users);
  } catch (e) {
    console.error("list branch users error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireGlobalRole(
      request,
      GlobalRole.BRANCH_ADMIN,
      GlobalRole.SUPER_ADMIN,
    );
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

    // ─── Path A: assign an existing dynamic role ──────────────────
    let resolvedRoleId: string;
    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role || role.branchId !== branch.id) {
        return rbacError("Role not found in this branch", 404);
      }
      resolvedRoleId = role.id;
    } else {
      // ─── Path B: create an inline role from validated grants ────
      const { grants, error } = validateGrantsAgainstScope(
        branch.branchPermissions,
        requested,
      );
      if (error) return rbacError(error, 403);

      const role = await prisma.role.create({
        data: {
          name: `${branch.code} - ${roleName}`,
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
        globalRole: GlobalRole.BRANCH_USER,
        branchId: branch.id,
        organizationId: branch.organizationId,
        roleId: resolvedRoleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        globalRole: true,
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
