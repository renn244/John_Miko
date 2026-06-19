-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "ReportSeverity" AS ENUM ('Low', 'Medium', 'High');

-- AlterEnum
ALTER TYPE "ReportType" ADD VALUE 'maintenance';

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_bookingId_fkey";

-- AlterTable
ALTER TABLE "Report"
ADD COLUMN "rejectionNote" TEXT,
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "status" "ReportStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN "severity" "ReportSeverity" NOT NULL DEFAULT 'Low',
ALTER COLUMN "bookingId" DROP NOT NULL;

-- Keep existing rows valid while requiring new records to provide severity.
ALTER TABLE "Report" ALTER COLUMN "severity" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Report_bookingId_idx" ON "Report"("bookingId");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_severity_idx" ON "Report"("severity");

-- CreateIndex
CREATE INDEX "Report_status_severity_idx" ON "Report"("status", "severity");

-- AddForeignKey
ALTER TABLE "Report"
ADD CONSTRAINT "Report_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
