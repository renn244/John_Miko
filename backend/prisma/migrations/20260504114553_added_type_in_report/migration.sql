/*
  Warnings:

  - Added the required column `type` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('checkIn', 'checkOut');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "type" "ReportType" NOT NULL;
