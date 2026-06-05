// ─── Branch RBAC/ABAC Seed ───────────────────────────────────────
// Run with:  npx ts-node prisma/seed-rbac.ts
//
// Dynamic model:
//   - Actions are rows in `actions` (create/read/update/delete/export).
//   - Super admin = User.isSuperAdmin (bypasses everything).
//   - Roles are dynamic with two scopes: SUPER_ADMIN (global) and BRANCH.
//   - "Branch admin" = a branch user whose role has users+roles CRUD.
// All passwords: "password123".

import "dotenv/config";
import { PrismaClient, RoleScope } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Default action catalog (mirrors BUILT_IN_ACTIONS in src/config/rbac.ts).
const BUILT_IN_ACTIONS = ["create", "read", "update", "delete", "export"];
const ALL = ["create", "read", "update", "delete", "export"];
const MANAGE = ["create", "read", "update", "delete"];

async function main() {
  console.log("🌱 Seeding Branch RBAC...");
  const pw = await bcryptjs.hash("password123", 10);

  // ─── Dynamic actions ────────────────────────────────────────────
  const LABELS: Record<string, string> = {
    create: "Create",
    read: "Read",
    update: "Update",
    delete: "Delete",
    export: "Export",
  };
  for (const key of BUILT_IN_ACTIONS) {
    await prisma.action.upsert({
      where: { key },
      update: {},
      create: { key, label: LABELS[key] ?? key, isBuiltIn: true },
    });
  }

  // ─── Organization ───────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { code: "RBAC-ORG" },
    update: {},
    create: { name: "RBAC Demo Org", code: "RBAC-ORG" },
  });

  // ─── Branches + scope ───────────────────────────────────────────
  const branchA = await prisma.branch.upsert({
    where: { code: "BR-A" },
    update: {},
    create: { name: "Branch A", code: "BR-A", location: "City A", organizationId: org.id },
  });
  await setScope(branchA.id, [
    { resource: "orders", actions: ALL },
    { resource: "products", actions: ["read"] },
    { resource: "users", actions: MANAGE },
    { resource: "roles", actions: MANAGE },
  ]);

  const branchB = await prisma.branch.upsert({
    where: { code: "BR-B" },
    update: {},
    create: { name: "Branch B", code: "BR-B", location: "City B", organizationId: org.id },
  });
  await setScope(branchB.id, [
    { resource: "orders", actions: ["read"] },
    { resource: "products", actions: ["create", "read"] },
    { resource: "users", actions: MANAGE },
    { resource: "roles", actions: MANAGE },
  ]);

  // ─── User 1: Super Admin ────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "superadmin@demo.com" },
    update: { isSuperAdmin: true },
    create: {
      name: "Super Admin",
      email: "superadmin@demo.com",
      password: pw,
      isSuperAdmin: true,
      organizationId: org.id,
    },
  });

  // ─── A SUPER_ADMIN-scope (global) role — demo of the second place ─
  await upsertRole("Platform Admin", RoleScope.SUPER_ADMIN, null, [
    { resource: "branches", actions: MANAGE },
    { resource: "actions", actions: MANAGE },
    { resource: "roles", actions: MANAGE },
    { resource: "users", actions: MANAGE },
  ]);

  // ─── Branch A: admin role (users+roles CRUD) + admin user ───────
  const adminRoleA = await upsertRole("BR-A - Branch Admin", RoleScope.BRANCH, branchA.id, [
    { resource: "users", actions: MANAGE },
    { resource: "roles", actions: MANAGE },
    { resource: "orders", actions: ALL },
  ]);
  await upsertBranchUser("admin.a@demo.com", "Branch A Admin", pw, branchA.id, org.id, adminRoleA.id);

  // ─── Branch A: read-only staff role + user (case 2) ─────────────
  const staffRoleA = await upsertRole("BR-A - Orders Staff", RoleScope.BRANCH, branchA.id, [
    { resource: "orders", actions: ["read"] },
  ]);
  await upsertBranchUser("staff.a@demo.com", "Branch A Staff", pw, branchA.id, org.id, staffRoleA.id);

  // ─── Branch B: admin role + user (isolated) ─────────────────────
  const adminRoleB = await upsertRole("BR-B - Branch Admin", RoleScope.BRANCH, branchB.id, [
    { resource: "users", actions: MANAGE },
    { resource: "roles", actions: MANAGE },
    { resource: "orders", actions: ["read"] },
  ]);
  await upsertBranchUser("admin.b@demo.com", "Branch B Admin", pw, branchB.id, org.id, adminRoleB.id);

  console.log("✅ RBAC seed complete (5 actions, 2 branches, 4 users, 4 roles).");
}

/** Replace a branch's permission scope idempotently. */
async function setScope(
  branchId: string,
  scope: { resource: string; actions: string[] }[],
) {
  for (const s of scope) {
    await prisma.branchPermission.upsert({
      where: { branchId_resource: { branchId, resource: s.resource } },
      update: { actions: s.actions },
      create: { branchId, resource: s.resource, actions: s.actions },
    });
  }
}

/** Create/refresh a role (any scope) with resource permissions. */
async function upsertRole(
  name: string,
  scope: RoleScope,
  branchId: string | null,
  grants: { resource: string; actions: string[] }[],
) {
  const role = await prisma.role.upsert({
    where: { name },
    update: { scope, branchId },
    create: { name, scope, branchId },
  });
  for (const g of grants) {
    await prisma.roleResourcePermission.upsert({
      where: { roleId_resource: { roleId: role.id, resource: g.resource } },
      update: { actions: g.actions },
      create: { roleId: role.id, resource: g.resource, actions: g.actions },
    });
  }
  return role;
}

async function upsertBranchUser(
  email: string,
  name: string,
  password: string,
  branchId: string,
  organizationId: string,
  roleId: string,
) {
  return prisma.user.upsert({
    where: { email },
    update: { branchId, roleId },
    create: { name, email, password, branchId, organizationId, roleId },
  });
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
