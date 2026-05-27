-- CreateTable
CREATE TABLE "Closure" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT,
    "date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Closure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Closure_accommodationId_idx" ON "Closure"("accommodationId");

-- CreateIndex
CREATE INDEX "Closure_date_idx" ON "Closure"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Closure_accommodationId_date_key" ON "Closure"("accommodationId", "date");

-- AddForeignKey
ALTER TABLE "Closure" ADD CONSTRAINT "Closure_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
