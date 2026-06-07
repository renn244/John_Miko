-- CreateEnum
CREATE TYPE "PreOrderStatus" AS ENUM ('Pending', 'Completed');

-- AlterTable
ALTER TABLE "PreOrderMenuItem" ADD COLUMN     "status" "PreOrderStatus" NOT NULL DEFAULT 'Pending';
