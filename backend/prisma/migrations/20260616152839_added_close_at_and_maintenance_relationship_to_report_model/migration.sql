/*
  Warnings:

  - A unique constraint covering the columns `[maintenanceId]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "closedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "maintenanceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Report_maintenanceId_key" ON "Report"("maintenanceId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
