CREATE TYPE "BookingSource" AS ENUM ('Online', 'Manual', 'WalkIn');

ALTER TABLE "Accommodation"
ADD COLUMN "retiredAt" TIMESTAMP(3);

ALTER TABLE "Booking"
ADD COLUMN "source" "BookingSource" NOT NULL DEFAULT 'Online';

CREATE INDEX "Accommodation_retiredAt_idx" ON "Accommodation"("retiredAt");
CREATE INDEX "Booking_source_idx" ON "Booking"("source");
