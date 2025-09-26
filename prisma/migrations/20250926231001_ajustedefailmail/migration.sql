-- CreateTable
CREATE TABLE "public"."fail_mail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fail_mail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fail_mail_email_key" ON "public"."fail_mail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fail_mail_user_id_key" ON "public"."fail_mail"("user_id");

-- AddForeignKey
ALTER TABLE "public"."fail_mail" ADD CONSTRAINT "fail_mail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;
