// /api/super-admin/branches — Super Admin only.
//   GET  → paginated list of branches (+ user counts)
//   POST → create a branch

import { Status } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
} from "@/src/lib/rbac";

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(request.url);
    const { page, limit, search } = getListParams(searchParams);
    const status = searchParams.get("status");

    const where = {
      ...(search
        ? {
            OR: [
              { code: { contains: search, mode: "insensitive" as const } },
              { city: { contains: search, mode: "insensitive" as const } },
              { country: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(status === "ACTIVE" || status === "INACTIVE"
        ? { status: status as Status }
        : {}),
    };

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [branches, totalItems] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take,
        include: { _count: { select: { users: true } } },
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
    const { code, contact, country, city, area, address, status } = body;

    const branch = await prisma.branch.create({
      data: {
        code: code || null,
        contact: contact || null,
        country: country || null,
        city: city || null,
        area: area || null,
        address: address || null,
        status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      },
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
