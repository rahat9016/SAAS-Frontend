// /api/branches/users
//   GET  → paginated list of users (branch-scoped for non-super-admin)
//   POST → create a user, mapped to a branch + role. NO permissions here —
//          permissions are assigned separately (PUT .../[id]/permissions).
// Guard: super admin, or a user with access to the "users" resource.

import bcryptjs from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  resolveTargetBranchId,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getListParams(searchParams);
    const platform = searchParams.get("platform") === "true";
    const branchParam = searchParams.get("branchId");

    // Branch scope:
    //  - non-super-admin → always their own branch
    //  - super admin + platform=true → platform users (branchId null)
    //  - super admin + branchId=X    → that branch
    //  - super admin (neither)       → all users
    let branchFilter: Record<string, unknown> = {};
    if (!admin.isSuperAdmin) {
      branchFilter = { branchId: admin.branchId ?? "__none__" };
    } else if (platform) {
      branchFilter = { branchId: null };
    } else if (branchParam) {
      branchFilter = { branchId: branchParam };
    }

    const where = {
      ...branchFilter,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
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
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          status: true,
          branchId: true,
          role: { select: { id: true, name: true, isSuperAdmin: true } },
          branch: { select: { id: true, code: true } },
          permissions: { select: { resource: true, actions: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return rbacPaginated(users, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list users error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const { firstName, lastName, email, password, phone, gender, dateOfBirth, roleId } = body;

    if (!firstName || !email || !password) {
      return rbacError("firstName, email and password are required", 400);
    }

    // Don't allow assigning the super-admin role through this endpoint.
    if (roleId) {
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      if (!role) return rbacError("Role not found", 404);
      if (role.isSuperAdmin) return rbacError("Cannot assign the SUPER_ADMIN role", 403);
    }

    const branchId = resolveTargetBranchId(admin, body.branchId);
    const hashed = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        password: hashed,
        roleId: roleId || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        branchId: branchId ?? null,
      },
      select: { id: true, firstName: true, email: true, roleId: true, branchId: true },
    });

    return rbacSuccess(user, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A user with this email or phone already exists", 409);
    }
    console.error("create user error:", e);
    return rbacError("Internal server error", 500);
  }
}
