/*
  Warnings:

  - The `year` column on the `Institution_Certifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Institution_Certifications" DROP COLUMN "year",
ADD COLUMN     "year" TIMESTAMP(3);
