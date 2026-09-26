-- Refuse to apply if existing active bookings already occupy the same slot.
-- Resolution is deliberately manual: never cancel or merge bookings automatically.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Booking"
    WHERE "status" <> 'Cancelled'
    GROUP BY "accommodationId", "bookingDate", "stayOptionId"
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot create Booking_active_slot_unique: active booking slot duplicates require manual resolution';
  END IF;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_active_slot_unique"
ON "Booking"("accommodationId", "bookingDate", "stayOptionId")
WHERE ("status" <> 'Cancelled');
