/*
  Warnings:

  - Added the required column `title_category` to the `Study_specialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Study_specialization" ADD COLUMN     "title_category" TEXT NOT NULL,
ALTER COLUMN "end_date" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
