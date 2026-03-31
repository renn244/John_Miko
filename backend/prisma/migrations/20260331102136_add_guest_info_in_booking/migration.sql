/*
  Warnings:

  - Added the required column `contactNo` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "numberOfGuests" INTEGER NOT NULL,
ADD COLUMN     "specialRequests" TEXT;
