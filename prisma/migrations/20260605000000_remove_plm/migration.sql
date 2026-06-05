-- DropForeignKey
ALTER TABLE "approval_histories" DROP CONSTRAINT "approval_histories_changed_by_fkey";

-- DropForeignKey
ALTER TABLE "approval_histories" DROP CONSTRAINT "approval_histories_design_id_fkey";

-- DropForeignKey
ALTER TABLE "approvals" DROP CONSTRAINT "approvals_design_id_fkey";

-- DropForeignKey
ALTER TABLE "approvals" DROP CONSTRAINT "approvals_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bill_of_materials" DROP CONSTRAINT "bill_of_materials_material_id_fkey";

-- DropForeignKey
ALTER TABLE "bill_of_materials" DROP CONSTRAINT "bill_of_materials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "product_designs" DROP CONSTRAINT "product_designs_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "product_designs" DROP CONSTRAINT "product_designs_designer_id_fkey";

-- DropForeignKey
ALTER TABLE "product_revisions" DROP CONSTRAINT "product_revisions_design_id_fkey";

-- DropForeignKey
ALTER TABLE "production_worksheets" DROP CONSTRAINT "production_worksheets_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "production_worksheets" DROP CONSTRAINT "production_worksheets_design_id_fkey";

-- DropForeignKey
ALTER TABLE "production_worksheets" DROP CONSTRAINT "production_worksheets_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_design_id_fkey";

-- DropForeignKey
ALTER TABLE "raw_material_allocations" DROP CONSTRAINT "raw_material_allocations_material_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles" DROP CONSTRAINT "user_roles_user_id_fkey";

-- DropTable
DROP TABLE "approval_histories";

-- DropTable
DROP TABLE "approvals";

-- DropTable
DROP TABLE "bill_of_materials";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "product_designs";

-- DropTable
DROP TABLE "product_revisions";

-- DropTable
DROP TABLE "production_worksheets";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "raw_material_allocations";

-- DropTable
DROP TABLE "raw_materials";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "user_roles";

-- DropEnum
DROP TYPE "ProductStatus";

