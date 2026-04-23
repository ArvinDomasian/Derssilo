-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'APPROVED';
