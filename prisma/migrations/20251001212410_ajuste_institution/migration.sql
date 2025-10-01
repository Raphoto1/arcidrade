/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Institution_Data` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Institution_Data" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Institution_Data_user_id_key" ON "public"."Institution_Data"("user_id");
