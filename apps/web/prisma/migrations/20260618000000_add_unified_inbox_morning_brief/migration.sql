-- AlterTable: EmailMessage gains subject + snippet for the unified inbox
ALTER TABLE "EmailMessage" ADD COLUMN "subject" TEXT,
ADD COLUMN "snippet" TEXT;

-- CreateIndex
CREATE INDEX "EmailMessage_emailAccountId_inbox_date_idx" ON "EmailMessage"("emailAccountId", "inbox", "date");

-- CreateEnum
CREATE TYPE "MorningBriefStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- AlterEnum
ALTER TYPE "MessagingRoutePurpose" ADD VALUE IF NOT EXISTS 'MORNING_BRIEFS';

-- CreateTable
CREATE TABLE "MorningBriefSchedule" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "intervalDays" INTEGER,
    "daysOfWeek" INTEGER,
    "timeOfDay" TIMESTAMP(3),
    "nextOccurrenceAt" TIMESTAMP(3),
    "lastOccurrenceAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),

    CONSTRAINT "MorningBriefSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MorningBriefSchedule_userId_key" ON "MorningBriefSchedule"("userId");

-- CreateIndex
CREATE INDEX "MorningBriefSchedule_enabled_nextOccurrenceAt_idx" ON "MorningBriefSchedule"("enabled", "nextOccurrenceAt");

-- AddForeignKey
ALTER TABLE "MorningBriefSchedule" ADD CONSTRAINT "MorningBriefSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "MorningBrief" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "executiveSummary" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" "MorningBriefStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "MorningBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MorningBrief_userId_idx" ON "MorningBrief"("userId");

-- AddForeignKey
ALTER TABLE "MorningBrief" ADD CONSTRAINT "MorningBrief_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MorningBrief" ADD CONSTRAINT "MorningBrief_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "MorningBriefSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "MorningBriefItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "morningBriefId" TEXT NOT NULL,
    "emailAccountId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "subject" TEXT,
    "summary" TEXT NOT NULL,
    "importanceScore" DOUBLE PRECISION,
    "category" TEXT,
    "actionNeeded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MorningBriefItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MorningBriefItem_morningBriefId_idx" ON "MorningBriefItem"("morningBriefId");

-- AddForeignKey
ALTER TABLE "MorningBriefItem" ADD CONSTRAINT "MorningBriefItem_morningBriefId_fkey" FOREIGN KEY ("morningBriefId") REFERENCES "MorningBrief"("id") ON DELETE CASCADE ON UPDATE CASCADE;
