/*
  Warnings:

  - You are about to drop the `colaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "colaborator" DROP CONSTRAINT "colaborator_user_id_fkey";

-- DropTable
DROP TABLE "colaborator";

-- CreateTable
CREATE TABLE "colaborator_data" (
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

    CONSTRAINT "colaborator_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "colaborator_data" ADD CONSTRAINT "colaborator_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;
