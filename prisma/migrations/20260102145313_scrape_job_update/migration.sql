-- AlterTable
ALTER TABLE "ChatLog" ALTER COLUMN "tokensUsed" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ScrapeJob" ADD COLUMN     "cost" INTEGER NOT NULL DEFAULT 0;
