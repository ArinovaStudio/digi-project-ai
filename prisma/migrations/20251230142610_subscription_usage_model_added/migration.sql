/*
  Warnings:

  - You are about to drop the column `count` on the `ChatLog` table. All the data in the column will be lost.
  - You are about to drop the column `ScrapeTimer` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyTokens` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `csv` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `lastScrapeAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `EndDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `ChatLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `ChatLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyCredits` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currentPeriodEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPeriodStart` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ScrapeStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "ChatLog" DROP CONSTRAINT "ChatLog_userId_fkey";

-- AlterTable
ALTER TABLE "ApiKey" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ChatLog" DROP COLUMN "count",
ADD COLUMN     "latency" INTEGER,
ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD COLUMN     "tokensUsed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "ScrapeTimer",
DROP COLUMN "monthlyTokens",
ADD COLUMN     "maxProjects" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "monthlyCredits" INTEGER NOT NULL,
ADD COLUMN     "scrapeFrequency" TEXT NOT NULL DEFAULT 'WEEKLY';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "csv",
DROP COLUMN "lastScrapeAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "csvPath" TEXT,
ADD COLUMN     "lastScrapedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT,
ADD COLUMN     "status" "ScrapeStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "url" SET NOT NULL;

-- AlterTable
ALTER TABLE "ScrapeJob" ADD COLUMN     "log" TEXT,
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "EndDate",
DROP COLUMN "startDate",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SubscriptionUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "scrapesUsed" INTEGER NOT NULL DEFAULT 0,
    "projectsAdded" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionUsage_userId_key" ON "SubscriptionUsage"("userId");

-- AddForeignKey
ALTER TABLE "SubscriptionUsage" ADD CONSTRAINT "SubscriptionUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapeJob" ADD CONSTRAINT "ScrapeJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
