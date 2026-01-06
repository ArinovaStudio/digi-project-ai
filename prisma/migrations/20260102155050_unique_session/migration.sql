/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `ChatLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatLog_sessionId_key" ON "ChatLog"("sessionId");
