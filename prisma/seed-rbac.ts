// ─── Branch RBAC Seed ────────────────────────────────────────────
// Run with:  npx ts-node prisma/seed-rbac.ts
//
// Model:
//   - role SUPER_ADMIN bypasses everything.
//   - branch admins / users are mapped to a branch and given per-user
//     route+action permissions (UserPermission).
// All passwords: "password123".

import "dotenv/config";
import { PrismaClient, Roles, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BUILT_IN_ACTIONS = ["create", "read", "update", "delete", "export"];
const ALL = ["create", "read", "update", "delete", "export"];
const MANAGE = ["create", "read", "update", "delete"];

async function main() {
  console.log("🌱 Seeding Branch RBAC...");
  const pw = await bcryptjs.hash("password123", 10);

  // Dynamic actions
  const LABELS: Record<string, string> = {
    create: "Create", read: "Read", update: "Update", delete: "Delete", export: "Export",
  };
  for (const key of BUILT_IN_ACTIONS) {
    await prisma.action.upsert({
      where: { key },
      update: {},
      create: { key, label: LABELS[key] ?? key, isBuiltIn: true },
    });
  }

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
    firstName: "Super", lastName: "Admin", password: pw, role: Roles.SUPER_ADMIN,
  }, []);

  // Branch A admin — manages users + full orders in branch A
  await upsertUser("admin.a@demo.com", {
    firstName: "Branch A", lastName: "Admin", password: pw, role: Roles.BRANCH_ADMIN, branchId: branchA.id,
  }, [
    { resource: "users", actions: MANAGE },
    { resource: "orders", actions: ALL },
  ]);

  // Branch A staff — read-only orders
  await upsertUser("staff.a@demo.com", {
    firstName: "Branch A", lastName: "Staff", password: pw, role: Roles.USER, branchId: branchA.id,
  }, [
    { resource: "orders", actions: ["read"] },
  ]);

  // Branch B admin — read orders, read users (isolated)
  await upsertUser("admin.b@demo.com", {
    firstName: "Branch B", lastName: "Admin", password: pw, role: Roles.BRANCH_ADMIN, branchId: branchB.id,
  }, [
    { resource: "users", actions: ["read"] },
    { resource: "orders", actions: ["read"] },
  ]);

  console.log("✅ RBAC seed complete (5 actions, 2 branches, 4 users).");
}

async function upsertUser(
  email: string,
  data: {
    firstName: string;
    lastName?: string;
    password: string;
    role: Roles;
    branchId?: string;
  },
  permissions: { resource: string; actions: string[] }[],
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: data.role, branchId: data.branchId ?? null },
    create: {
      email,
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      password: data.password,
      role: data.role,
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
