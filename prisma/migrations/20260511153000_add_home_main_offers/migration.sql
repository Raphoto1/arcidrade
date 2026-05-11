-- CreateTable
CREATE TABLE "HomePageDataMainOffers" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageDataMainOffers_pkey" PRIMARY KEY ("id")
);
