-- CreateEnum
CREATE TYPE "AuthSessionPlatform" AS ENUM ('WEB', 'MOBILE');

-- CreateTable
CREATE TABLE "AuthRefreshSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "platform" "AuthSessionPlatform" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthRefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthRefreshSession_userId_revokedAt_idx" ON "AuthRefreshSession"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "AuthRefreshSession_expiresAt_idx" ON "AuthRefreshSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "AuthRefreshSession"
ADD CONSTRAINT "AuthRefreshSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
