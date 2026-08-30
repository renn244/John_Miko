ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'Refunded';

ALTER TABLE "Payment"
ADD COLUMN "refundReason" TEXT,
ADD COLUMN "refundedAt" TIMESTAMP(3),
ADD COLUMN "refundedById" TEXT;

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_refundedById_fkey"
FOREIGN KEY ("refundedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Payment_refundedById_idx" ON "Payment"("refundedById");
