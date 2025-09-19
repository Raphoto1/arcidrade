/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Main_study` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Main_study_user_id_key" ON "public"."Main_study"("user_id");
