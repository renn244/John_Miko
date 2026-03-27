-- DropForeignKey
ALTER TABLE "BookedAccommodation" DROP CONSTRAINT "BookedAccommodation_bookingId_fkey";

-- AddForeignKey
ALTER TABLE "BookedAccommodation" ADD CONSTRAINT "BookedAccommodation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
