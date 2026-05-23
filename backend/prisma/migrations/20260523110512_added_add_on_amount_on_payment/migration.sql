/*
  Warnings:

  - Added the required column `addOnAmount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "addOnAmount" INTEGER;

UPDATE "Payment" SET "addOnAmount" = 0;

ALTER TABLE "Payment" ALTER COLUMN "addOnAmount" SET NOT NULL;