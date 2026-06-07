import { prisma } from "@/src/lib/prisma";
import { ok, fail } from "@/src/lib/auth-tokens";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!user) {
      return fail("User not found", 404);
    }

    const userInformation = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName || "",
      phone: user.phone,
      profilePicture: user.profilePicture || null,
      isVerified: user.isVerified,
      status: user.status,
      role: user.role,
      branchId: user.branchId,
      branchCode: user.branch?.code || null,
    };

    return ok(userInformation);
  } catch (e: unknown) {
    console.error("Fetch user error:", e);
    return fail("Internal server error", 500);
  }
}
