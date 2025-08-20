-- CreateEnum
CREATE TYPE "public"."AreasAvailable" AS ENUM ('institution', 'profesional', 'manager', 'collab', 'campaign');

-- CreateEnum
CREATE TYPE "public"."StatusAvailable" AS ENUM ('pending_invitation', 'invited', 'registered', 'active', 'desactivated');

-- CreateEnum
CREATE TYPE "public"."SenderNum" AS ENUM ('victor', 'campaign', 'admin');

-- CreateTable
CREATE TABLE "public"."Auth" (
    "referCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "area" "public"."AreasAvailable" NOT NULL,
    "status" "public"."StatusAvailable" NOT NULL,
    "invitation_sender" "public"."SenderNum" NOT NULL,
    "invitation_sender_id" TEXT NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("referCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "public"."Auth"("email");
