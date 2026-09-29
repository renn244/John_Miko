-- A valid ID is required for new online bookings. Existing payment records
-- remain valid because they were created before this requirement.
ALTER TABLE "Payment" ADD COLUMN "validIdImageUrl" TEXT;
