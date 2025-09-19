/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Profesional_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profesional_data_user_id_key" ON "public"."Profesional_data"("user_id");
