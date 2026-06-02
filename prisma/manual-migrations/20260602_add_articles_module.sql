CREATE TABLE IF NOT EXISTS "Article" (
  "id" SERIAL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "shortText" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "contentHtml" TEXT NOT NULL,
  "publishedAt" TIMESTAMP(3) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Article_publishedAt_idx" ON "Article" ("publishedAt");
CREATE INDEX IF NOT EXISTS "Article_isActive_idx" ON "Article" ("isActive");

CREATE TABLE IF NOT EXISTS "SiteSectionVisibility" (
  "id" SERIAL PRIMARY KEY,
  "sectionKey" TEXT NOT NULL UNIQUE,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "SiteSectionVisibility" ("sectionKey", "isActive")
VALUES ('articles', false)
ON CONFLICT ("sectionKey") DO NOTHING;
