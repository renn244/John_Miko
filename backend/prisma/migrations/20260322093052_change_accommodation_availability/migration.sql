/*
  Warnings:

  - The values [Occupied,OutofService] on the enum `AccommodationAvailability` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccommodationAvailability_new" AS ENUM ('Available', 'Unavailable', 'Maintenance');
ALTER TABLE "Accommodation" ALTER COLUMN "availability" TYPE "AccommodationAvailability_new" USING ("availability"::text::"AccommodationAvailability_new");
ALTER TYPE "AccommodationAvailability" RENAME TO "AccommodationAvailability_old";
ALTER TYPE "AccommodationAvailability_new" RENAME TO "AccommodationAvailability";
DROP TYPE "public"."AccommodationAvailability_old";
COMMIT;
