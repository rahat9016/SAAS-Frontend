// ─── Branch RBAC/ABAC Seed ───────────────────────────────────────
// Separate from prisma/seed.ts (PLM) so the two seed flows don't clash.
// Run with:  npx ts-node prisma/seed-rbac.ts
//
// Creates:
//   - 1 Organization
//   - Branch A (orders: create/read/update/export, products: read)
//   - Branch B (orders: read, products: create/read) — isolated from A
//   - User 1: Super Admin            (global access)
//   - User 2: Branch A Admin         (full Branch A scope)
//   - User 3: Branch A Staff         (read-only on orders, via a Role)
//   - User 4: Branch B Admin         (isolated from Branch A)
// All passwords: "password123".

import "dotenv/config";
import { PrismaClient, GlobalRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Branch RBAC...");
  const pw = await bcryptjs.hash("password123", 10);

  // ─── Organization ───────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { code: "RBAC-ORG" },
    update: {},
    create: { name: "RBAC Demo Org", code: "RBAC-ORG" },
  });

  // ─── Branch A + scope ───────────────────────────────────────────
  const branchA = await prisma.branch.upsert({
    where: { code: "BR-A" },
    update: {},
    create: {
      name: "Branch A",
      code: "BR-A",
      location: "City A",
      organizationId: org.id,
    },
  });
  await setScope(branchA.id, [
    { resource: "orders", actions: ["create", "read", "update", "export"] },
    { resource: "products", actions: ["read"] },
  ]);

  // ─── Branch B + scope (isolated) ────────────────────────────────
  const branchB = await prisma.branch.upsert({
    where: { code: "BR-B" },
    update: {},
    create: {
      name: "Branch B",
      code: "BR-B",
      location: "City B",
      organizationId: org.id,
    },
  });
  await setScope(branchB.id, [
    { resource: "orders", actions: ["read"] },
    { resource: "products", actions: ["create", "read"] },
  ]);

  // ─── User 1: Super Admin ────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "superadmin@demo.com" },
    update: { globalRole: GlobalRole.SUPER_ADMIN },
    create: {
      name: "Super Admin",
      email: "superadmin@demo.com",
      password: pw,
      globalRole: GlobalRole.SUPER_ADMIN,
      organizationId: org.id,
    },
  });

  // ─── User 2: Branch A Admin ─────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin.a@demo.com" },
    update: { globalRole: GlobalRole.BRANCH_ADMIN, branchId: branchA.id },
    create: {
      name: "Branch A Admin",
      email: "admin.a@demo.com",
      password: pw,
      globalRole: GlobalRole.BRANCH_ADMIN,
      branchId: branchA.id,
      organizationId: org.id,
    },
  });

  // ─── User 3: Branch A Staff (role: read orders only) ────────────
  const staffRole = await upsertBranchRole(branchA.id, "BR-A - Orders Staff", [
    { resource: "orders", actions: ["read"] },
  ]);
  await prisma.user.upsert({
    where: { email: "staff.a@demo.com" },
    update: {
      globalRole: GlobalRole.BRANCH_USER,
      branchId: branchA.id,
      roleId: staffRole.id,
    },
    create: {
      name: "Branch A Staff",
      email: "staff.a@demo.com",
      password: pw,
      globalRole: GlobalRole.BRANCH_USER,
      branchId: branchA.id,
      organizationId: org.id,
      roleId: staffRole.id,
    },
  });

  // ─── User 4: Branch B Admin (isolated from A) ───────────────────
  await prisma.user.upsert({
    where: { email: "admin.b@demo.com" },
    update: { globalRole: GlobalRole.BRANCH_ADMIN, branchId: branchB.id },
    create: {
      name: "Branch B Admin",
      email: "admin.b@demo.com",
      password: pw,
      globalRole: GlobalRole.BRANCH_ADMIN,
      branchId: branchB.id,
      organizationId: org.id,
    },
  });

  console.log("✅ RBAC seed complete (4 users, 2 branches).");
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

/** Create/refresh a branch-scoped role with resource permissions. */
async function upsertBranchRole(
  branchId: string,
  name: string,
  grants: { resource: string; actions: string[] }[],
) {
  const role = await prisma.role.upsert({
    where: { name },
    update: { branchId },
    create: { name, branchId },
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
