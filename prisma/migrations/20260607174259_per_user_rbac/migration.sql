-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_ADMIN', 'BRANCH_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropForeignKey
ALTER TABLE "branch_permissions" DROP CONSTRAINT "branch_permissions_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "branches" DROP CONSTRAINT "branches_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "role_resource_permissions" DROP CONSTRAINT "role_resource_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "is_active",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "organization_id",
ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "area" VARCHAR(100),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "contact" VARCHAR(255),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
DROP COLUMN "is_super_admin",
DROP COLUMN "name",
DROP COLUMN "organization_id",
DROP COLUMN "role_id",
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "last_name" VARCHAR(100),
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "profile_picture" VARCHAR(255),
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "branch_permissions";

-- DropTable
DROP TABLE "organizations";

-- DropTable
DROP TABLE "role_resource_permissions";

-- DropTable
DROP TABLE "roles";

-- DropEnum
DROP TYPE "RoleScope";

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "actions" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "label" VARCHAR(100),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_resource_key" ON "user_permissions"("user_id", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_status_idx" ON "users"("email", "status");

-- CreateIndex
CREATE INDEX "users_first_name_last_name_idx" ON "users"("first_name", "last_name");

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

