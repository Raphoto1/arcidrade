-- CreateIndex
CREATE INDEX "Auth_status_idx" ON "Auth"("status");

-- CreateIndex
CREATE INDEX "Auth_area_idx" ON "Auth"("area");

-- CreateIndex
CREATE INDEX "Auth_status_area_idx" ON "Auth"("status", "area");
