/*
  Warnings:

  - Added the required column `browser` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "browser" TEXT NOT NULL;
