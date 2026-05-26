-- CreateEnum
CREATE TYPE "ReviewModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "flagged_reason" VARCHAR(255),
ADD COLUMN     "moderated_at" TIMESTAMP(3),
ADD COLUMN     "moderated_by" TEXT,
ADD COLUMN     "moderation_status" "ReviewModerationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rejection_reason" VARCHAR(255);

-- CreateIndex
CREATE INDEX "reviews_moderation_status_created_at_idx" ON "reviews"("moderation_status", "created_at");

-- CreateIndex
CREATE INDEX "reviews_moderation_status_flagged_reason_idx" ON "reviews"("moderation_status", "flagged_reason");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: existing reviews keep their customer-facing visibility (set to APPROVED).
-- New reviews go to the moderation queue via the schema default (PENDING).
UPDATE "reviews" SET "moderation_status" = 'APPROVED';
