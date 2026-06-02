// ─── PLM API Helpers ─────────────────────────────────────────────
// Shared utilities for Next.js API route handlers

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/src/lib/prisma";
import { ProductStatus } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "plm-super-secret-key";

// ─── Response Helpers (match frontend {data, meta} format) ────────

export function success<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ data, ...(meta ? { meta } : {}) });
}

export function paginated<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ statusCode: status, message }, { status });
}

// ─── Auth Helpers ─────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  branchId: string | null;
  organizationId: string | null;
}

export function signTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify the authenticated user from a Request.
 * Returns the full user profile with roles & permissions from the DB.
 */
export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
        },
      },
      branch: true,
      organization: true,
    },
  });

  if (!user) return null;

  const roles = user.userRoles.map((ur) => ur.role.name);
  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.key),
      ),
    ),
  ];

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    roles,
    permissions,
    branchId: user.branchId,
    branchName: user.branch?.name || null,
    organizationId: user.organizationId,
    organizationName: user.organization?.name || null,
  };
}

/** Guard: requires authentication */
export async function requireAuth(request: Request) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, errorResponse: error("Unauthorized", 401) };
  return { user, errorResponse: null };
}

/** Guard: requires specific permission */
export async function requirePermission(
  request: Request,
  ...requiredPermissions: string[]
) {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };

  const hasPermission = requiredPermissions.some((p) =>
    user!.permissions.includes(p),
  );

  if (!hasPermission) {
    return {
      user: null,
      errorResponse: error(
        `Access denied: requires [${requiredPermissions.join(", ")}]`,
        403,
      ),
    };
  }

  return { user: user!, errorResponse: null };
}

/** Guard: requires specific role */
export async function requireRole(
  request: Request,
  ...requiredRoles: string[]
) {
  const { user, errorResponse } = await requireAuth(request);
  if (errorResponse) return { user: null, errorResponse };

  const hasRole = requiredRoles.some((r) => user!.roles.includes(r));
  if (!hasRole) {
    return {
      user: null,
      errorResponse: error(
        `Access denied: requires role [${requiredRoles.join(", ")}]`,
        403,
      ),
    };
  }

  return { user: user!, errorResponse: null };
}

// ─── ABAC Helpers ─────────────────────────────────────────────────

const BRANCH_SCOPED_ROLES = [
  "BRANCH_MODERATOR",
  "DESIGN_TEAM",
  "PRODUCTION_TEAM",
  "INVENTORY_TEAM",
];

export function isBranchScoped(roles: string[]): boolean {
  if (roles.includes("SUPER_ADMIN")) return false;
  return roles.some((r) => BRANCH_SCOPED_ROLES.includes(r));
}

// ─── Query Param Helpers ──────────────────────────────────────────

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "";
  return { page, limit, search, status, sortBy };
}

// ─── Status Transition Rules ──────────────────────────────────────

export const STATUS_TRANSITIONS: Record<ProductStatus, ProductStatus[]> = {
  [ProductStatus.CONCEPT]: [ProductStatus.DESIGN_IN_PROGRESS],
  [ProductStatus.DESIGN_IN_PROGRESS]: [ProductStatus.DESIGN_SUBMITTED],
  [ProductStatus.DESIGN_SUBMITTED]: [ProductStatus.MODERATOR_REVIEW],
  [ProductStatus.MODERATOR_REVIEW]: [
    ProductStatus.MODERATOR_APPROVED,
    ProductStatus.MODERATOR_REJECTED,
    ProductStatus.REDESIGN_REQUIRED,
  ],
  [ProductStatus.MODERATOR_APPROVED]: [ProductStatus.SUPER_ADMIN_REVIEW],
  [ProductStatus.MODERATOR_REJECTED]: [ProductStatus.REDESIGN_REQUIRED],
  [ProductStatus.SUPER_ADMIN_REVIEW]: [
    ProductStatus.SUPER_ADMIN_APPROVED,
    ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED,
    ProductStatus.SUPER_ADMIN_REJECTED,
  ],
  [ProductStatus.SUPER_ADMIN_PARTIAL_APPROVED]: [
    ProductStatus.PROTOTYPE,
    ProductStatus.SAMPLE_DEVELOPMENT,
  ],
  [ProductStatus.SUPER_ADMIN_APPROVED]: [
    ProductStatus.PROTOTYPE,
    ProductStatus.SAMPLE_DEVELOPMENT,
  ],
  [ProductStatus.SUPER_ADMIN_REJECTED]: [
    ProductStatus.MODERATOR_REVIEW,
    ProductStatus.REDESIGN_REQUIRED,
  ],
  [ProductStatus.REDESIGN_REQUIRED]: [ProductStatus.DESIGN_IN_PROGRESS],
  [ProductStatus.PROTOTYPE]: [ProductStatus.SELLS_MAN_SAMPLE],
  [ProductStatus.SELLS_MAN_SAMPLE]: [
    ProductStatus.PRODUCTION_WORKSHEET_CREATED,
    ProductStatus.SAMPLE_DEVELOPMENT,
  ],
  [ProductStatus.SAMPLE_DEVELOPMENT]: [ProductStatus.RAW_MATERIAL_ALLOCATED],
  [ProductStatus.RAW_MATERIAL_ALLOCATED]: [
    ProductStatus.PRODUCTION_WORKSHEET_CREATED,
  ],
  [ProductStatus.PRODUCTION_WORKSHEET_CREATED]: [
    ProductStatus.READY_FOR_PRODUCTION,
  ],
  [ProductStatus.READY_FOR_PRODUCTION]: [ProductStatus.IN_PRODUCTION],
  [ProductStatus.IN_PRODUCTION]: [ProductStatus.QUALITY_CHECK],
  [ProductStatus.QUALITY_CHECK]: [
    ProductStatus.READY_FOR_BRANCH,
    ProductStatus.FREE_FOR_BRANCH,
  ],
  [ProductStatus.READY_FOR_BRANCH]: [
    ProductStatus.FREE_FOR_BRANCH,
    ProductStatus.LIVE_FOR_SALE,
  ],
  [ProductStatus.FREE_FOR_BRANCH]: [ProductStatus.FFW],
  [ProductStatus.FFW]: [ProductStatus.LIVE_FOR_SALE],
  [ProductStatus.LIVE_FOR_SALE]: [],
};

export function isValidTransition(
  from: ProductStatus,
  to: ProductStatus,
): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
