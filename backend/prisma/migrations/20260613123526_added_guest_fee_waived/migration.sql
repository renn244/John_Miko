-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "isGuestFeeWaived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "guestFeeWaivedSnapshot" BOOLEAN NOT NULL DEFAULT false;
