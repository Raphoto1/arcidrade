/*
  Warnings:

  - You are about to drop the column `main_specialty` on the `Institution_Data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Institution_Data" DROP COLUMN "main_specialty",
ADD COLUMN     "main_speciality" TEXT;
