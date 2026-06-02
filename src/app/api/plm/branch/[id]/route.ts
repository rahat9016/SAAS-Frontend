import { prisma } from "@/src/lib/prisma";
import { requirePermission, success, error } from "@/src/lib/plm-api";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.branch.view");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        departments: true,
        _count: { select: { designs: true, users: true, worksheets: true } },
      },
    });
    if (!branch) return error("Branch not found", 404);
    return success(branch);
  } catch (e: unknown) {
    console.error("Branch detail error:", e);
    return error("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.branch.create");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.branch.findUnique({ where: { id } });
    if (!existing) return error("Branch not found", 404);

    const body = await request.json();
    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.code !== undefined && { code: body.code }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return success(branch);
  } catch (e: unknown) {
    console.error("Branch update error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { errorResponse } = await requirePermission(request, "plm.branch.delete");
    if (errorResponse) return errorResponse;
    const { id } = await params;

    const existing = await prisma.branch.findUnique({ where: { id } });
    if (!existing) return error("Branch not found", 404);

    await prisma.branch.delete({ where: { id } });
    return success({ message: "Branch deleted" });
  } catch (e: unknown) {
    console.error("Branch delete error:", e);
    return error("Internal server error", 500);
  }
}
