/*
  Warnings:

  - You are about to drop the column `fullName` on the `user_model` table. All the data in the column will be lost.
  - You are about to drop the `_role_junction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_role_junction" DROP CONSTRAINT "_role_junction_A_fkey";

-- DropForeignKey
ALTER TABLE "_role_junction" DROP CONSTRAINT "_role_junction_B_fkey";

-- AlterTable
ALTER TABLE "user_model" DROP COLUMN "fullName";

-- DropTable
DROP TABLE "_role_junction";

-- DropTable
DROP TABLE "user_role";
