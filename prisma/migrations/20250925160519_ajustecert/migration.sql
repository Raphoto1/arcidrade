/*
  Warnings:

  - A unique constraint covering the columns `[study_speciality_id]` on the table `Study_speciality_favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Profesional_certifications" ALTER COLUMN "end_date" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "file" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Study_speciality_favorite_study_speciality_id_key" ON "public"."Study_speciality_favorite"("study_speciality_id");
