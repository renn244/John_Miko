-- CreateEnum
CREATE TYPE "ClosureType" AS ENUM ('Close', 'Private');

-- AlterTable
ALTER TABLE "Closure" ADD COLUMN     "type" "ClosureType" NOT NULL DEFAULT 'Close',
ALTER COLUMN "reason" DROP NOT NULL;
