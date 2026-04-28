-- Defensive patch: ensure terms fields exist even if a previous migration was marked as applied
-- but underlying DDL did not run in some environments.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'Profesional_extra_data'
    ) THEN
        ALTER TABLE "Profesional_extra_data"
            ADD COLUMN IF NOT EXISTS "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
            ADD COLUMN IF NOT EXISTS "terms_accepted_at" TIMESTAMP(3);
    END IF;
END
$$;
