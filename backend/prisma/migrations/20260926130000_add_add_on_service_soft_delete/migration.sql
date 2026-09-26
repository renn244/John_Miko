ALTER TABLE "AddOnService"
ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "AddOnService_deletedAt_idx" ON "AddOnService"("deletedAt");
