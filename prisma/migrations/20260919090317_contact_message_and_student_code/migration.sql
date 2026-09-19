-- AlterTable: add StudentProfile.code as nullable first so existing rows can be backfilled
ALTER TABLE "StudentProfile" ADD COLUMN "code" TEXT;

UPDATE "StudentProfile" SET "code" = 'STU-' || upper(substr(md5(random()::text || id), 1, 6)) WHERE "code" IS NULL;

ALTER TABLE "StudentProfile" ALTER COLUMN "code" SET NOT NULL;

CREATE UNIQUE INDEX "StudentProfile_code_key" ON "StudentProfile"("code");

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
