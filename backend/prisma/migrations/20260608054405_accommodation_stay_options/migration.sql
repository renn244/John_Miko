/*
  Warnings:

  - You are about to drop the column `availability` on the `Accommodation` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `stayOptionCodeSnapshot` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stayOptionId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stayOptionLabelSnapshot` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accommodation" DROP COLUMN "availability";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "timeSlot",
ADD COLUMN     "stayDurationHoursSnapshot" INTEGER,
ADD COLUMN     "stayOptionCodeSnapshot" TEXT NOT NULL,
ADD COLUMN     "stayOptionId" TEXT NOT NULL,
ADD COLUMN     "stayOptionLabelSnapshot" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AccommodationAvailability";

-- DropEnum
DROP TYPE "BookingTimeSlot";

-- CreateTable
CREATE TABLE "AccommodationStayOption" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "durationHours" INTEGER,
    "startTime" TIME,
    "endTime" TIME,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccommodationStayOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccommodationStayOption_accommodationId_idx" ON "AccommodationStayOption"("accommodationId");

-- CreateIndex
CREATE INDEX "AccommodationStayOption_accommodationId_isActive_sortOrder_idx" ON "AccommodationStayOption"("accommodationId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AccommodationStayOption_accommodationId_code_key" ON "AccommodationStayOption"("accommodationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "AccommodationStayOption_id_accommodationId_key" ON "AccommodationStayOption"("id", "accommodationId");

-- CreateIndex
-- CREATE UNIQUE INDEX "Booking_active_slot_unqiue"
-- ON "Booking" ("accommodationId", "stayOptionId", "bookingDate")
-- WHERE "status" IN ('Pending', 'Confirmed', 'Completed');

-- CreateIndex
CREATE INDEX "Booking_accommodationId_bookingDate_idx" ON "Booking"("accommodationId", "bookingDate");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_bookingDate_status_idx" ON "Booking"("bookingDate", "status");

-- CreateIndex
CREATE INDEX "Booking_bookingDate_stayOptionId_idx" ON "Booking"("bookingDate", "stayOptionId");

-- AddForeignKey
ALTER TABLE "AccommodationStayOption" ADD CONSTRAINT "AccommodationStayOption_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_stayOptionId_accommodationId_fkey" FOREIGN KEY ("stayOptionId", "accommodationId") REFERENCES "AccommodationStayOption"("id", "accommodationId") ON DELETE RESTRICT ON UPDATE CASCADE;
