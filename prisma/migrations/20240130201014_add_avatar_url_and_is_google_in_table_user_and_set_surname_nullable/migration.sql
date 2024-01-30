-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "is_google" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "surname" DROP NOT NULL;
