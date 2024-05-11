/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sessions_sessionId_key" ON "Sessions"("sessionId");
