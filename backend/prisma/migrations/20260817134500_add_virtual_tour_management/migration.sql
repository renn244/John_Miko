CREATE TYPE "VirtualTourSceneStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
CREATE TYPE "PanoramaProcessingStatus" AS ENUM ('EMPTY', 'PROCESSING', 'READY', 'FAILED');
CREATE TYPE "VirtualTourHotspotType" AS ENUM ('NAVIGATION', 'INFORMATION');

CREATE TABLE "VirtualTour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'John Miko''s Place Virtual Tour',
    "startingSceneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VirtualTour_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VirtualTourScene" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "VirtualTourSceneStatus" NOT NULL DEFAULT 'DRAFT',
    "panoramaStatus" "PanoramaProcessingStatus" NOT NULL DEFAULT 'EMPTY',
    "processingError" TEXT,
    "originalUrl" TEXT,
    "previewUrl" TEXT,
    "tilesBaseUrl" TEXT,
    "tileCols" INTEGER NOT NULL DEFAULT 8,
    "tileRows" INTEGER NOT NULL DEFAULT 4,
    "panoramaWidth" INTEGER,
    "initialYaw" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "initialPitch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VirtualTourScene_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VirtualTourHotspot" (
    "id" TEXT NOT NULL,
    "sourceSceneId" TEXT NOT NULL,
    "type" "VirtualTourHotspotType" NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "yaw" DOUBLE PRECISION NOT NULL,
    "pitch" DOUBLE PRECISION NOT NULL,
    "targetSceneId" TEXT,
    "infoTitle" TEXT,
    "infoDescription" TEXT,
    "infoImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VirtualTourHotspot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VirtualTour_startingSceneId_key" ON "VirtualTour"("startingSceneId");
CREATE UNIQUE INDEX "VirtualTourScene_slug_key" ON "VirtualTourScene"("slug");
CREATE INDEX "VirtualTourScene_tourId_status_idx" ON "VirtualTourScene"("tourId", "status");
CREATE INDEX "VirtualTourHotspot_sourceSceneId_idx" ON "VirtualTourHotspot"("sourceSceneId");
CREATE INDEX "VirtualTourHotspot_targetSceneId_idx" ON "VirtualTourHotspot"("targetSceneId");
CREATE INDEX "VirtualTourHotspot_sourceSceneId_isActive_idx" ON "VirtualTourHotspot"("sourceSceneId", "isActive");

ALTER TABLE "VirtualTour"
  ADD CONSTRAINT "VirtualTour_startingSceneId_fkey"
  FOREIGN KEY ("startingSceneId") REFERENCES "VirtualTourScene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "VirtualTourScene"
  ADD CONSTRAINT "VirtualTourScene_tourId_fkey"
  FOREIGN KEY ("tourId") REFERENCES "VirtualTour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VirtualTourHotspot"
  ADD CONSTRAINT "VirtualTourHotspot_sourceSceneId_fkey"
  FOREIGN KEY ("sourceSceneId") REFERENCES "VirtualTourScene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VirtualTourHotspot"
  ADD CONSTRAINT "VirtualTourHotspot_targetSceneId_fkey"
  FOREIGN KEY ("targetSceneId") REFERENCES "VirtualTourScene"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
