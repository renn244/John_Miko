/*
  Warnings:

  - Added the required column `expertise` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MaintenanceExpertise" AS ENUM ('Electrical', 'Pool', 'Construction');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MAINTENANCE_STAFF';

-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "expertise" "MaintenanceExpertise" NOT NULL,
ADD COLUMN     "resolutionProofImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expertise" "MaintenanceExpertise";

-- CreateIndex
CREATE INDEX "Maintenance_expertise_idx" ON "Maintenance"("expertise");

-- CreateIndex
CREATE INDEX "Maintenance_assignedToId_idx" ON "Maintenance"("assignedToId");

-- CreateIndex
CREATE INDEX "Maintenance_status_expertise_idx" ON "Maintenance"("status", "expertise");

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
