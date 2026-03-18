-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('Room', 'Cottage', 'EventHall');

-- CreateEnum
CREATE TYPE "AccommodationAvailability" AS ENUM ('Occupied', 'Available', 'OutofService');

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" "AccommodationType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability" "AccommodationAvailability" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);
