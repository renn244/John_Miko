/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `BookedAccommodation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `BookedAccommodation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Full', 'Partial');

-- AlterTable
ALTER TABLE "BookedAccommodation" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookedAccommodation_bookingId_key" ON "BookedAccommodation"("bookingId");

-- AddForeignKey
ALTER TABLE "BookedAccommodation" ADD CONSTRAINT "BookedAccommodation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
