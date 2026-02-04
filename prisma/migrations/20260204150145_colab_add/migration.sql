/*
  Warnings:

  - The values [collab] on the enum `AreasAvailable` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AreasAvailable_new" AS ENUM ('institution', 'profesional', 'manager', 'colab', 'campaign', 'victor');
ALTER TABLE "Auth" ALTER COLUMN "area" TYPE "AreasAvailable_new" USING ("area"::text::"AreasAvailable_new");
ALTER TYPE "AreasAvailable" RENAME TO "AreasAvailable_old";
ALTER TYPE "AreasAvailable_new" RENAME TO "AreasAvailable";
DROP TYPE "public"."AreasAvailable_old";
COMMIT;

-- AlterEnum
ALTER TYPE "SenderNum" ADD VALUE 'colab';

-- CreateTable
CREATE TABLE "colaborator" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "last_name" TEXT,
    "role" TEXT,
    "description" TEXT,
    "status" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "file" TEXT,
    "link" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colaborator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colaborator" ADD CONSTRAINT "colaborator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;
