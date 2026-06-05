// /api/super-admin/actions — dynamic action catalog (the "attributes").
//   GET  → paginated list of actions
//   POST → create a new action (e.g. "approve", "publish")
// Super admin only.

import { prisma } from "@/src/lib/prisma";
import {
  requireSuperAdmin,
  rbacError,
  rbacSuccess,
  rbacPaginated,
  getListParams,
} from "@/src/lib/rbac";

const KEY_RE = /^[a-z][a-z0-9_]*$/;

export async function GET(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const { page, limit, search } = getListParams(new URL(request.url).searchParams);
    const where = search
      ? {
          OR: [
            { key: { contains: search, mode: "insensitive" as const } },
            { label: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const skip = limit === -1 ? undefined : (page - 1) * limit;
    const take = limit === -1 ? undefined : limit;

    const [actions, totalItems] = await Promise.all([
      prisma.action.findMany({ where, skip, take, orderBy: { createdAt: "asc" } }),
      prisma.action.count({ where }),
    ]);

    return rbacPaginated(actions, totalItems, page, limit === -1 ? totalItems : limit);
  } catch (e) {
    console.error("list actions error:", e);
    return rbacError("Internal server error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { errorResponse } = await requireSuperAdmin(request);
    if (errorResponse) return errorResponse;

    const body = await request.json();
    const key = String(body.key ?? "").trim().toLowerCase();
    const label = String(body.label ?? "").trim();

    if (!key || !label) return rbacError("key and label are required", 400);
    if (!KEY_RE.test(key)) {
      return rbacError("key must be lowercase letters/numbers/underscore, starting with a letter", 400);
    }

    const action = await prisma.action.create({ data: { key, label } });
    return rbacSuccess(action, 201);
  } catch (e: unknown) {
    if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") {
      return rbacError("An action with this key already exists", 409);
    }
    console.error("create action error:", e);
    return rbacError("Internal server error", 500);
  }
}
