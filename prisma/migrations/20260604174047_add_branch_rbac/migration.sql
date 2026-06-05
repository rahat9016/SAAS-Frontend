-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('SUPER_ADMIN', 'BRANCH_ADMIN', 'BRANCH_USER');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "branch_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "global_role" "GlobalRole" NOT NULL DEFAULT 'BRANCH_USER',
ADD COLUMN     "role_id" TEXT;

-- CreateTable
CREATE TABLE "branch_permissions" (
    "id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "branch_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_resource_permissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "role_resource_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_permissions_branch_id_resource_key" ON "branch_permissions"("branch_id", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "role_resource_permissions_role_id_resource_key" ON "role_resource_permissions"("role_id", "resource");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_permissions" ADD CONSTRAINT "branch_permissions_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_resource_permissions" ADD CONSTRAINT "role_resource_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
