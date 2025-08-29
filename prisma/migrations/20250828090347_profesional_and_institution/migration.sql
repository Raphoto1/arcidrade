-- CreateEnum
CREATE TYPE "public"."Sub_area" AS ENUM ('doctor', 'nurse');

-- AlterEnum
ALTER TYPE "public"."SenderNum" ADD VALUE 'external';

-- CreateTable
CREATE TABLE "public"."Profesional_data" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "fake_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "local_id" TEXT NOT NULL,
    "cv_file" TEXT NOT NULL,
    "cv_link" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profesional_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Main_study" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "sub_area" "public"."Sub_area" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Main_study_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Study_specialization" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "sub_area" "public"."Sub_area" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Study_specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Study_speciality_favorite" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "study_speciality_id" INTEGER NOT NULL,
    "study_fav" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Study_speciality_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profesional_certifications" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profesional_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Institution_Data" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "fake_name" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "main_specialty" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "established" TIMESTAMP(3) NOT NULL,
    "website" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Institution_specialization" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Institution_Certifications" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_Certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Goals" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Profesional_data" ADD CONSTRAINT "Profesional_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Main_study" ADD CONSTRAINT "Main_study_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Study_specialization" ADD CONSTRAINT "Study_specialization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Study_speciality_favorite" ADD CONSTRAINT "Study_speciality_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profesional_certifications" ADD CONSTRAINT "Profesional_certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Institution_Data" ADD CONSTRAINT "Institution_Data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Institution_specialization" ADD CONSTRAINT "Institution_specialization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Institution_Certifications" ADD CONSTRAINT "Institution_Certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Goals" ADD CONSTRAINT "Goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;
