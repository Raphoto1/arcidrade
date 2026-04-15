-- AlterTable
ALTER TABLE "Profesional_extra_data" ADD COLUMN     "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Institution_extra_data" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "terms_accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_extra_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_extra_data_user_id_key" ON "Institution_extra_data"("user_id");

-- AddForeignKey
ALTER TABLE "Institution_extra_data" ADD CONSTRAINT "Institution_extra_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;
