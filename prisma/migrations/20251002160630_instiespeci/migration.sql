-- AlterTable
ALTER TABLE "Institution_specialization" ADD COLUMN     "title_category" TEXT,
ALTER COLUMN "title" DROP NOT NULL;
