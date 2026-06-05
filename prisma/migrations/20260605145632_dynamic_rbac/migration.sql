/*
  Warnings:

  - You are about to drop the column `global_role` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('SUPER_ADMIN', 'BRANCH');

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "scope" "RoleScope" NOT NULL DEFAULT 'BRANCH';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "global_role",
ADD COLUMN     "is_super_admin" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "GlobalRole";

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_built_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "actions_key_key" ON "actions"("key");
