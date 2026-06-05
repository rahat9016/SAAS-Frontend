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
      include: { branch: true, organization: true },
    });

    if (!user) {
      return fail("User not found", 404);
    }

    // Split name into first/last for IUserInformation compatibility.
    const nameParts = user.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userInformation = {
      id: user.id,
      email: user.email,
      firstName,
      lastName,
      phone: null,
      profilePicture: user.avatar || null,
      isVerified: true,
      status: "ACTIVE",
      role: user.globalRole, // single global role string
      branchId: user.branchId,
      branchName: user.branch?.name || null,
      organizationId: user.organizationId,
      organizationName: user.organization?.name || null,
    };

    return ok(userInformation);
  } catch (e: unknown) {
    console.error("Fetch user error:", e);
    return fail("Internal server error", 500);
  }
}
