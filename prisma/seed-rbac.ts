// ─── Branch RBAC Seed ────────────────────────────────────────────
// Run with:  npx ts-node prisma/seed-rbac.ts
//
// Model:
//   - Roles are dynamic labels; only SUPER_ADMIN is built-in/constant.
//   - role.isSuperAdmin bypasses everything.
//   - users are mapped to a branch + role; route+action permissions are
//     assigned PER USER (UserPermission). Action keys are UPPERCASE.
// All passwords: "password123".

import "dotenv/config";
import { PrismaClient, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BUILT_IN_ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT"];
const ALL = ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT"];
const MANAGE = ["CREATE", "READ", "UPDATE", "DELETE"];

async function main() {
  console.log("🌱 Seeding Branch RBAC...");
  const pw = await bcryptjs.hash("password123", 10);

  // Dynamic actions (UPPERCASE)
  for (const key of BUILT_IN_ACTIONS) {
    await prisma.action.upsert({
      where: { key },
      update: {},
      create: { key, label: key.charAt(0) + key.slice(1).toLowerCase(), isBuiltIn: true },
    });
  }

  // Roles (only SUPER_ADMIN is built-in)
  const superRole = await upsertRole("SUPER_ADMIN", { isSuperAdmin: true, isBuiltIn: true });
  const branchAdminRole = await upsertRole("BRANCH_ADMIN", {});
  const staffRole = await upsertRole("STAFF", {});

  // Branches
  const branchA = await prisma.branch.upsert({
    where: { code: "BR-A" },
    update: {},
    create: { code: "BR-A", city: "Dhaka", country: "Bangladesh", contact: "+8801000000001", status: Status.ACTIVE },
  });
  const branchB = await prisma.branch.upsert({
    where: { code: "BR-B" },
    update: {},
    create: { code: "BR-B", city: "Chittagong", country: "Bangladesh", contact: "+8801000000002", status: Status.ACTIVE },
  });

  // Super admin
  await upsertUser("superadmin@demo.com", {
    firstName: "Super", lastName: "Admin", password: pw, roleId: superRole.id,
  }, []);

  // Branch A admin — manage users + full orders
  await upsertUser("admin.a@demo.com", {
    firstName: "Branch A", lastName: "Admin", password: pw, roleId: branchAdminRole.id, branchId: branchA.id,
  }, [
    { resource: "users", actions: MANAGE },
    { resource: "permissions", actions: MANAGE },
    { resource: "orders", actions: ALL },
  ]);

  // Branch A staff — read-only orders
  await upsertUser("staff.a@demo.com", {
    firstName: "Branch A", lastName: "Staff", password: pw, roleId: staffRole.id, branchId: branchA.id,
  }, [
    { resource: "orders", actions: ["READ"] },
  ]);

  // Branch B admin — read orders/users (isolated)
  await upsertUser("admin.b@demo.com", {
    firstName: "Branch B", lastName: "Admin", password: pw, roleId: branchAdminRole.id, branchId: branchB.id,
  }, [
    { resource: "users", actions: ["READ"] },
    { resource: "orders", actions: ["READ"] },
  ]);

  console.log("✅ RBAC seed complete (5 actions, 3 roles, 2 branches, 4 users).");
}

async function upsertRole(
  name: string,
  opts: { isSuperAdmin?: boolean; isBuiltIn?: boolean },
) {
  return prisma.role.upsert({
    where: { name },
    update: { isSuperAdmin: opts.isSuperAdmin ?? false, isBuiltIn: opts.isBuiltIn ?? false },
    create: { name, isSuperAdmin: opts.isSuperAdmin ?? false, isBuiltIn: opts.isBuiltIn ?? false },
  });
}

async function upsertUser(
  email: string,
  data: { firstName: string; lastName?: string; password: string; roleId?: string; branchId?: string },
  permissions: { resource: string; actions: string[] }[],
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { roleId: data.roleId ?? null, branchId: data.branchId ?? null },
    create: {
      email,
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      password: data.password,
      roleId: data.roleId ?? null,
      branchId: data.branchId ?? null,
    },
  });
  for (const p of permissions) {
    await prisma.userPermission.upsert({
      where: { userId_resource: { userId: user.id, resource: p.resource } },
      update: { actions: p.actions },
      create: { userId: user.id, resource: p.resource, actions: p.actions },
    });
  }
  return user;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
