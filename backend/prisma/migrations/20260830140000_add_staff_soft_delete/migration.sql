ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "User_role_status_deletedAt_idx" ON "User"("role", "status", "deletedAt");
