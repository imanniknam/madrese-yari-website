-- DropForeignKey
ALTER TABLE "SchoolNeedRequest" DROP CONSTRAINT "SchoolNeedRequest_schoolId_fkey";

-- AlterTable
ALTER TABLE "SchoolNeedRequest" DROP COLUMN "rawDescription",
DROP COLUMN "requestedItems",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "itemQty" INTEGER NOT NULL,
ADD COLUMN     "itemTitle" TEXT NOT NULL,
ADD COLUMN     "needType" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "schoolCode" TEXT,
ADD COLUMN     "schoolName" TEXT NOT NULL,
ALTER COLUMN "schoolId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SchoolNeedRequest_code_key" ON "SchoolNeedRequest"("code");

-- AddForeignKey
ALTER TABLE "SchoolNeedRequest" ADD CONSTRAINT "SchoolNeedRequest_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
