/*
  Warnings:

  - Added the required column `adultGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kidGuests` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seniorGuest` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "adultGuests" INTEGER NOT NULL,
ADD COLUMN     "kidGuests" INTEGER NOT NULL,
ADD COLUMN     "seniorGuest" INTEGER NOT NULL;
