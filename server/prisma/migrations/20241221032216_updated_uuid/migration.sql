/*
  Warnings:

  - The primary key for the `user_model` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_profile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_userId_fkey";

-- AlterTable
ALTER TABLE "user_model" DROP CONSTRAINT "user_model_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_model_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "user_model_userId_seq";

-- AlterTable
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_pkey",
ALTER COLUMN "profileId" DROP DEFAULT,
ALTER COLUMN "profileId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_profile_pkey" PRIMARY KEY ("profileId");
DROP SEQUENCE "user_profile_profileId_seq";

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_model"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
