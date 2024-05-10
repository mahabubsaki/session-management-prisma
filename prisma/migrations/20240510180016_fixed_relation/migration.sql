/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_token_fkey";

-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
