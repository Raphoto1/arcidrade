-- AlterEnum
ALTER TYPE "AreasAvailable" ADD VALUE 'profesional_general';

-- AlterEnum
ALTER TYPE "Sub_area" ADD VALUE 'general';

-- CreateTable
CREATE TABLE "Profesional_extra_data" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "has_european_docs" BOOLEAN NOT NULL DEFAULT false,
    "needs_sponsor" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profesional_extra_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageOrder" (
    "id" SERIAL NOT NULL,
    "area" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageDataCarousel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageDataCarousel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageDataMainEspecialities" (
    "id" SERIAL NOT NULL,
    "speciality" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageDataMainEspecialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPageData" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesPageData" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicesPageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPageData" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPageData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterData" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FooterData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralProfesionalSubAreas" (
    "id" SERIAL NOT NULL,
    "sub_area" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralProfesionalSubAreas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_extra_data_user_id_key" ON "Profesional_extra_data"("user_id");

-- AddForeignKey
ALTER TABLE "Profesional_extra_data" ADD CONSTRAINT "Profesional_extra_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;
