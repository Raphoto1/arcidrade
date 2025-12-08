-- DropForeignKey
ALTER TABLE "Campaign_data" DROP CONSTRAINT "Campaign_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Goals" DROP CONSTRAINT "Goals_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Institution_Certifications" DROP CONSTRAINT "Institution_Certifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Institution_Data" DROP CONSTRAINT "Institution_Data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Institution_specialization" DROP CONSTRAINT "Institution_specialization_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Leads_send" DROP CONSTRAINT "Leads_send_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Main_study" DROP CONSTRAINT "Main_study_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Process" DROP CONSTRAINT "Process_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Profesional_certifications" DROP CONSTRAINT "Profesional_certifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Profesional_data" DROP CONSTRAINT "Profesional_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Study_speciality_favorite" DROP CONSTRAINT "Study_speciality_favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Study_specialization" DROP CONSTRAINT "Study_specialization_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fail_mail" DROP CONSTRAINT "fail_mail_user_id_fkey";

-- AddForeignKey
ALTER TABLE "fail_mail" ADD CONSTRAINT "fail_mail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional_data" ADD CONSTRAINT "Profesional_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Main_study" ADD CONSTRAINT "Main_study_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study_specialization" ADD CONSTRAINT "Study_specialization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Study_speciality_favorite" ADD CONSTRAINT "Study_speciality_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional_certifications" ADD CONSTRAINT "Profesional_certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution_Data" ADD CONSTRAINT "Institution_Data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution_specialization" ADD CONSTRAINT "Institution_specialization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institution_Certifications" ADD CONSTRAINT "Institution_Certifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign_data" ADD CONSTRAINT "Campaign_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads_send" ADD CONSTRAINT "Leads_send_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Process" ADD CONSTRAINT "Process_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth"("referCode") ON DELETE CASCADE ON UPDATE CASCADE;
