-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Need" ADD COLUMN     "beneficiaryMeta" JSONB;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "person" TEXT;
