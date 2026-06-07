// /api/branches/users
//   GET  → paginated list of users (branch-scoped for non-super-admin)
//   POST → create a user, map to a branch, and assign per-user permissions
//          (resource + actions) — the super admin decides routes/actions.
// Guard: super admin, or a user with access to the "users" resource.

import bcryptjs from "bcryptjs";
import { Roles } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireManage,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
  resolveTargetBranchId,
  validateGrants,
  getActionKeys,
  type GrantInput,
} from "@/src/lib/rbac";

const ASSIGNABLE_ROLES: Roles[] = [Roles.BRANCH_ADMIN, Roles.USER];

export async function GET(request: Request) {
  try {
    const { user: admin, errorResponse } = await requireManage(request, "users");
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getListParams(searchParams);
    const branchId = resolveTargetBranchId(admin, searchParams.get("branchId") ?? undefined);

    const where = {
      ...(branchId ? { branchId } : {}),
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
          role: true,
          status: true,
          branchId: true,
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
    const { firstName, lastName, email, password, phone, gender, dateOfBirth } = body;
    const role: Roles = ASSIGNABLE_ROLES.includes(body.role) ? body.role : Roles.USER;
    const requested: GrantInput[] = body.permissions ?? [];

    if (!firstName || !email || !password) {
      return rbacError("firstName, email and password are required", 400);
    }

    const branchId = resolveTargetBranchId(admin, body.branchId);

    const actionKeys = await getActionKeys();
    const { grants, error } = validateGrants(requested, actionKeys);
    if (error) return rbacError(error, 400);

    const hashed = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || null,
        email,
        phone: phone || null,
        password: hashed,
        role,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        branchId: branchId ?? null,
        permissions: { create: grants },
      },
      select: { id: true, firstName: true, email: true, role: true, branchId: true },
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
