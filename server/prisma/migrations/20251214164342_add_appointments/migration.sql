/*
  Warnings:

  - You are about to drop the column `fromNodeId` on the `MapEdge` table. All the data in the column will be lost.
  - You are about to drop the column `toNodeId` on the `MapEdge` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `MapEdge` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[fromId,toId]` on the table `MapEdge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockchainId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fromId` to the `MapEdge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toId` to the `MapEdge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MapEdge" DROP CONSTRAINT "MapEdge_fromNodeId_fkey";

-- DropForeignKey
ALTER TABLE "MapEdge" DROP CONSTRAINT "MapEdge_toNodeId_fkey";

-- AlterTable
ALTER TABLE "MapEdge" DROP COLUMN "fromNodeId",
DROP COLUMN "toNodeId",
ADD COLUMN     "fromId" INTEGER NOT NULL,
ADD COLUMN     "toId" INTEGER NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "latestVitals" JSONB,
ADD COLUMN     "painLevel" INTEGER,
ADD COLUMN     "painReportedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT,
ADD COLUMN     "symptoms" TEXT,
ADD COLUMN     "weight" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockchainId" TEXT;

-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sideEffects" TEXT,
    "interactions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "medicationId" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPatientRelation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "relation" TEXT NOT NULL,

    CONSTRAINT "UserPatientRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "type" TEXT NOT NULL DEFAULT 'consultation',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPatientRelation_userId_patientId_key" ON "UserPatientRelation"("userId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MapEdge_fromId_toId_key" ON "MapEdge"("fromId", "toId");

-- CreateIndex
CREATE UNIQUE INDEX "User_blockchainId_key" ON "User"("blockchainId");

-- AddForeignKey
ALTER TABLE "MapEdge" ADD CONSTRAINT "MapEdge_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "MapNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapEdge" ADD CONSTRAINT "MapEdge_toId_fkey" FOREIGN KEY ("toId") REFERENCES "MapNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPatientRelation" ADD CONSTRAINT "UserPatientRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPatientRelation" ADD CONSTRAINT "UserPatientRelation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
