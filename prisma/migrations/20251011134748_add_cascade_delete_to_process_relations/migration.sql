-- DropForeignKey
ALTER TABLE "public"."extra_specialities" DROP CONSTRAINT "extra_specialities_process_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."profesionals_listed" DROP CONSTRAINT "profesionals_listed_process_id_fkey";

-- AddForeignKey
ALTER TABLE "extra_specialities" ADD CONSTRAINT "extra_specialities_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesionals_listed" ADD CONSTRAINT "profesionals_listed_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "Process"("id") ON DELETE CASCADE ON UPDATE CASCADE;
