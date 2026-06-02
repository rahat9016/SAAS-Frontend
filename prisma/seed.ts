// ─── Prisma Seed Script ──────────────────────────────────────────
// Seeds: Organization, Branches, Roles, Permissions, Users, Sample Designs

import "dotenv/config";
import { PrismaClient, ProductStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcryptjs from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Permissions ──────────────────────────────────────────────────
const PERMISSIONS = [
  { key: "plm.dashboard.view", description: "View PLM dashboard", module: "plm" },
  { key: "plm.branch.view", description: "View branches", module: "plm" },
  { key: "plm.branch.create", description: "Create/update branches", module: "plm" },
  { key: "plm.branch.delete", description: "Delete branches", module: "plm" },
  { key: "plm.design.view", description: "View designs", module: "plm" },
  { key: "plm.design.create", description: "Create designs", module: "plm" },
  { key: "plm.design.submit", description: "Submit designs for review", module: "plm" },
  { key: "plm.design.advance", description: "Advance design status", module: "plm" },
  { key: "plm.moderation.review", description: "Review designs", module: "plm" },
  { key: "plm.moderation.approve", description: "Approve designs", module: "plm" },
  { key: "plm.moderation.reject", description: "Reject designs", module: "plm" },
  { key: "plm.moderation.sendToAdmin", description: "Send to admin", module: "plm" },
  { key: "plm.approval.decide", description: "Final approval decision", module: "plm" },
  { key: "plm.production.view", description: "View production", module: "plm" },
  { key: "plm.production.advance", description: "Advance production", module: "plm" },
  { key: "plm.inventory.view", description: "View inventory", module: "plm" },
  { key: "plm.inventory.manage", description: "Manage inventory", module: "plm" },
];

// ─── Role → Permission Map ────────────────────────────────────────
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    "plm.dashboard.view", "plm.branch.view", "plm.branch.create", "plm.branch.delete",
    "plm.design.view", "plm.approval.decide", "plm.production.view", "plm.inventory.view",
  ],
  BRANCH_MODERATOR: [
    "plm.branch.view", "plm.design.view",
    "plm.moderation.review", "plm.moderation.approve", "plm.moderation.reject", "plm.moderation.sendToAdmin",
  ],
  DESIGN_TEAM: [
    "plm.design.view", "plm.design.create", "plm.design.submit", "plm.design.advance",
  ],
  PRODUCTION_TEAM: [
    "plm.design.view", "plm.production.view", "plm.production.advance",
  ],
  INVENTORY_TEAM: [
    "plm.production.view", "plm.inventory.view", "plm.inventory.manage",
  ],
};

async function main() {
  console.log("🌱 Seeding PLM database...");

  // 1. Create Permissions
  const permMap: Record<string, string> = {};
  for (const p of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { key: p.key },
      update: {},
      create: p,
    });
    permMap[p.key] = perm.id;
  }
  console.log(`✅ ${PERMISSIONS.length} permissions created`);

  // 2. Create Roles + assign permissions
  const roleMap: Record<string, string> = {};
  for (const [roleName, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `Built-in ${roleName.replace(/_/g, " ")} role`,
        isBuiltIn: true,
      },
    });
    roleMap[roleName] = role.id;

    for (const key of permKeys) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permMap[key] } },
        update: {},
        create: { roleId: role.id, permissionId: permMap[key] },
      });
    }
  }
  console.log(`✅ ${Object.keys(ROLE_PERMISSIONS).length} roles created`);

  // 3. Create Organization
  const org = await prisma.organization.upsert({
    where: { code: "XPLAZA" },
    update: {},
    create: { name: "X-Plaza", code: "XPLAZA" },
  });
  console.log(`✅ Organization: ${org.name}`);

  // 4. Create Branches
  const branchDhaka = await prisma.branch.upsert({
    where: { code: "DHK-01" },
    update: {},
    create: { id: "branch-dhk-01", name: "Dhaka Main", code: "DHK-01", location: "Dhaka, Bangladesh", organizationId: org.id },
  });
  const branchCtg = await prisma.branch.upsert({
    where: { code: "CTG-01" },
    update: {},
    create: { id: "branch-ctg-01", name: "Chittagong Branch", code: "CTG-01", location: "Chittagong, Bangladesh", organizationId: org.id },
  });
  console.log(`✅ 2 branches created`);

  // 5. Create Users (password: "password123")
  const hashedPw = await bcryptjs.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@xplaza.com" },
    update: {},
    create: { id: "user-sa-001", name: "Super Admin", email: "admin@xplaza.com", password: hashedPw, organizationId: org.id },
  });

  const moderator = await prisma.user.upsert({
    where: { email: "kamal@xplaza.com" },
    update: {},
    create: { id: "user-mod-001", name: "Kamal Hossain", email: "kamal@xplaza.com", password: hashedPw, organizationId: org.id, branchId: branchDhaka.id },
  });

  const designer = await prisma.user.upsert({
    where: { email: "fatima@xplaza.com" },
    update: {},
    create: { id: "user-design-001", name: "Fatima Rahman", email: "fatima@xplaza.com", password: hashedPw, organizationId: org.id, branchId: branchDhaka.id },
  });

  const prodUser = await prisma.user.upsert({
    where: { email: "sohel@xplaza.com" },
    update: {},
    create: { id: "user-prod-001", name: "Sohel Mia", email: "sohel@xplaza.com", password: hashedPw, organizationId: org.id, branchId: branchDhaka.id },
  });

  const invUser = await prisma.user.upsert({
    where: { email: "rafiq@xplaza.com" },
    update: {},
    create: { id: "user-inv-001", name: "Rafiq Khan", email: "rafiq@xplaza.com", password: hashedPw, organizationId: org.id },
  });
  console.log(`✅ 5 users created`);

  // 6. Assign Roles to Users
  const assignments: [string, string][] = [
    [superAdmin.id, "SUPER_ADMIN"],
    [moderator.id, "BRANCH_MODERATOR"],
    [designer.id, "DESIGN_TEAM"],
    [prodUser.id, "PRODUCTION_TEAM"],
    [invUser.id, "INVENTORY_TEAM"],
  ];
  for (const [userId, roleName] of assignments) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: roleMap[roleName] } },
      update: {},
      create: { userId, roleId: roleMap[roleName], assignedBy: superAdmin.id },
    });
  }
  console.log(`✅ Role assignments created`);

  // 7. Create Sample Designs
  const designs = [
    { name: "Summer Collection Dress A", description: "Light cotton dress for summer", category: "Dresses", status: ProductStatus.CONCEPT },
    { name: "Embroidered Kameez B", description: "Hand-embroidered kameez design", category: "Kameez", status: ProductStatus.DESIGN_IN_PROGRESS },
    { name: "Silk Saree Design C", description: "Premium silk saree with border", category: "Sarees", status: ProductStatus.MODERATOR_REVIEW },
    { name: "Casual Shirt D", description: "Casual cotton shirt for men", category: "Shirts", status: ProductStatus.MODERATOR_APPROVED },
    { name: "Formal Suit E", description: "3-piece formal suit", category: "Suits", status: ProductStatus.SUPER_ADMIN_REVIEW },
    { name: "Lehenga Design F", description: "Bridal lehenga with heavy work", category: "Bridal", status: ProductStatus.SUPER_ADMIN_REVIEW },
    { name: "Panjabi Design G", description: "Cotton panjabi for Eid", category: "Panjabi", status: ProductStatus.SUPER_ADMIN_APPROVED },
    { name: "Kids Frock H", description: "Kids party frock", category: "Kids", status: ProductStatus.IN_PRODUCTION },
  ];

  for (const d of designs) {
    const existing = await prisma.productDesign.findFirst({ where: { name: d.name } });
    if (!existing) {
      await prisma.productDesign.create({
        data: {
          ...d,
          designerId: designer.id,
          branchId: branchDhaka.id,
        },
      });
    }
  }
  console.log(`✅ ${designs.length} sample designs created`);

  // 8. Create Raw Materials
  const materials = [
    { name: "Cotton Fabric", sku: "MAT-COT-001", category: "Fabric", unit: "meters", totalStock: 500, availableStock: 500, reorderLevel: 50, unitCost: 120 },
    { name: "Silk Fabric", sku: "MAT-SLK-001", category: "Fabric", unit: "meters", totalStock: 200, availableStock: 200, reorderLevel: 30, unitCost: 450 },
    { name: "Thread Spool", sku: "MAT-THR-001", category: "Thread", unit: "spools", totalStock: 1000, availableStock: 1000, reorderLevel: 100, unitCost: 25 },
    { name: "Buttons Pack", sku: "MAT-BTN-001", category: "Accessories", unit: "packs", totalStock: 300, availableStock: 300, reorderLevel: 50, unitCost: 15 },
    { name: "Zipper", sku: "MAT-ZIP-001", category: "Accessories", unit: "pcs", totalStock: 500, availableStock: 500, reorderLevel: 80, unitCost: 10 },
  ];

  for (const m of materials) {
    await prisma.rawMaterial.upsert({
      where: { sku: m.sku },
      update: {},
      create: m,
    });
  }
  console.log(`✅ ${materials.length} raw materials created`);

  console.log("\n🎉 Seed completed!");
  console.log("\n📋 Login credentials (password: password123):");
  console.log("   Super Admin:  admin@xplaza.com");
  console.log("   Moderator:    kamal@xplaza.com");
  console.log("   Designer:     fatima@xplaza.com");
  console.log("   Production:   sohel@xplaza.com");
  console.log("   Inventory:    rafiq@xplaza.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
