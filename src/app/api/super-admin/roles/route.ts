// /api/super-admin/roles — dynamic role labels. Super admin only.
//   GET  → paginated list
//   POST → create a role (name forced UPPERCASE). Only super admin.
// Roles carry no permissions (those are per-user); a role is a tier label.
// The built-in SUPER_ADMIN role is created by the seed and protected.

import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
} from "@/src/lib/rbac";

const NAME_RE = /^[A-Z][A-Z0-9_]*$/;

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { page, limit, search } = getListParams(new URL(request.url).searchParams);
    const where = search
      ? { name: { contains: search.toUpperCase(), mode: "insensitive" as const } }
      : {};

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [roles, totalItems] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        include: { _count: { select: { users: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.role.count({ where }),
    ]);

    return rbacPaginated(roles, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list roles error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const name = String(body.name ?? "").trim().toUpperCase();
    if (!name) return rbacError("name is required", 400);
    if (!NAME_RE.test(name)) {
      return rbacError("name must be UPPERCASE letters/numbers/underscore, starting with a letter", 400);
    }
    if (name === "SUPER_ADMIN") {
      return rbacError("SUPER_ADMIN is reserved", 400);
    }

    const role = await prisma.role.create({ data: { name } });
    return rbacSuccess(role, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("A role with this name already exists", 409);
    }
    console.error("create role error:", e);
    return rbacError("Internal server error", 500);
  }
}
