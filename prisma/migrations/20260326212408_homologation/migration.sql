-- AlterTable
ALTER TABLE "Main_study" ADD COLUMN     "isHomologated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profesional_certifications" ADD COLUMN     "isHomologated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Study_specialization" ADD COLUMN     "isHomologated" BOOLEAN NOT NULL DEFAULT false;
