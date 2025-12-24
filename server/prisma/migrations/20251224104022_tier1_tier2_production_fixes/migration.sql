/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequence` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "sequence" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "emergency_alerts" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "vitalType" TEXT NOT NULL,
    "value" TEXT,
    "notes" TEXT,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredVia" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "acknowledgedBy" INTEGER,
    "acknowledgedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastRetryAt" TIMESTAMP(3),
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "emergency_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "emergency_alerts_patientId_triggeredAt_idx" ON "emergency_alerts"("patientId", "triggeredAt");

-- CreateIndex
CREATE INDEX "emergency_alerts_deliveredAt_acknowledgedAt_idx" ON "emergency_alerts"("deliveredAt", "acknowledgedAt");

-- CreateIndex
CREATE INDEX "emergency_alerts_resolved_idx" ON "emergency_alerts"("resolved");

-- CreateIndex
CREATE UNIQUE INDEX "messages_idempotencyKey_key" ON "messages"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_alerts" ADD CONSTRAINT "emergency_alerts_acknowledgedBy_fkey" FOREIGN KEY ("acknowledgedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
