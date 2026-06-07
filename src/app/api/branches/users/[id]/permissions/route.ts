// /api/branches/users/[id]/permissions
//   GET → the user's current per-user permissions
//   PUT → replace the user's permissions (resource + UPPERCASE actions)
// This is the SEPARATE permission-assignment flow (super admin decides
// which routes + actions a user gets). Guard: access to the "users" resource.

import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  validateGrants,
  getActionKeys,
  type RbacUser,
  type GrantInput,
} from "@/src/lib/rbac";

type Ctx = { params: Promise<{ id: string }> };

async function loadUser(admin: RbacUser, id: string) {
  const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
  if (!user) return { user: null, error: rbacError("User not found", 404) };
  if (!admin.isSuperAdmin && user.branchId !== admin.branchId) {
    return { user: null, error: rbacError("Access denied: user in another branch", 403) };
  }
  return { user, error: null as null };
}

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;
    const { id } = await params;
    const { user, error } = await loadUser(admin, id);
    if (error) return error;

    const permissions = await prisma.userPermission.findMany({
      where: { userId: id },
      select: { resource: true, actions: true },
    });
    return rbacSuccess({
      userId: id,
      isSuperAdmin: user!.role?.isSuperAdmin ?? false,
      permissions,
    });
  } catch (e) {
    console.error("get user permissions error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;
    const { id } = await params;
    const { error } = await loadUser(admin, id);
    if (error) return error;

    const requested: GrantInput[] = (await request.json()).permissions ?? [];
    const { grants, error: vErr } = validateGrants(requested, await getActionKeys());
    if (vErr) return rbacError(vErr, 400);

    await prisma.$transaction(async (tx) => {
      await tx.userPermission.deleteMany({ where: { userId: id } });
      if (grants.length) {
        await tx.userPermission.createMany({
          data: grants.map((g) => ({ userId: id, ...g })),
        });
      }
    });

    return rbacSuccess({ userId: id, permissions: grants });
  } catch (e) {
    console.error("set user permissions error:", e);
    return rbacError("Internal server error", 500);
  }
}

// Allow PATCH as an alias for PUT (frontend uses the patch helper).
export { PUT as PATCH };
