-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "resolutionNotes" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);
