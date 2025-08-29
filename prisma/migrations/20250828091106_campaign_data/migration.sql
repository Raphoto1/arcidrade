-- CreateTable
CREATE TABLE "public"."Campaign_data" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Leads_send" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leads_send_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Campaign_data" ADD CONSTRAINT "Campaign_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Leads_send" ADD CONSTRAINT "Leads_send_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Auth"("referCode") ON DELETE RESTRICT ON UPDATE CASCADE;
