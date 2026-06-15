import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { success, error } from "@/src/lib/plm-api";

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: { module: "asc" },
    });

    // Group by module for easier frontend rendering
    const grouped = permissions.reduce(
      (acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
      },
      {} as Record<string, typeof permissions>
    );

    return success(grouped);
  } catch (e: unknown) {
    console.error("Permission list error:", e);
    return error("Internal server error", 500);
  }
}
