-- AddColumn contact to ServicesPageData
ALTER TABLE "ServicesPageData" ADD COLUMN "contact" BOOLEAN NOT NULL DEFAULT false;
