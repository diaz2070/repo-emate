-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "active" DROP DEFAULT,
ALTER COLUMN "registrationDate" DROP NOT NULL,
ALTER COLUMN "registrationDate" DROP DEFAULT;
