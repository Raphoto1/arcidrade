-- CreateEnum
CREATE TYPE "process_type" AS ENUM ('arcidrade', 'auto', 'external', 'none');

-- CreateEnum
CREATE TYPE "process_status" AS ENUM ('pending', 'in_process', 'active', 'paused', 'completed', 'archived', 'rejected', 'none');

-- CreateEnum
CREATE TYPE "process_status_profesional" AS ENUM ('pending', 'in_process', 'listed', 'selected', 'rejected', 'hidden', 'none');

-- CreateTable
CREATE TABLE "Process" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "area" TEXT,
    "main_speciality" TEXT,
    "approval_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "profesional_status" TEXT,
    "description" TEXT,
    "type" "process_type" NOT NULL DEFAULT 'none',
    "status" "process_status" NOT NULL DEFAULT 'none',
    "extended" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extra_specialities" (
    "id" SERIAL NOT NULL,
    "process_id" INTEGER NOT NULL,
    "speciality" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extra_specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesionals_listed" (
    "id" SERIAL NOT NULL,
    "profesional_id" TEXT NOT NULL,
    "process_id" INTEGER NOT NULL,
    "is_arcidrade" BOOLEAN DEFAULT false,
    "process_status" "process_status_profesional" NOT NULL DEFAULT 'none',
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profesionals_listed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extra_specialities" ADD CONSTRAINT "extra_specialities_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesionals_listed" ADD CONSTRAINT "profesionals_listed_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
