'use client'

import { useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";

import { useHandleCategoryName } from "@/hooks/useUtils";
import {
  getFullName,
  getBaseFileName,
  loadLogoDataUrl,
  collectAttachmentEntries,
  packageAttachments,
  downloadBlob,
} from "@/utils/professionalProfileDownload.utils";
import { createWorkbook } from "@/utils/professionalProfileDownload.excel";
import { buildProfilePdf } from "@/utils/professionalProfileDownload.pdf";

type UseProfessionalProfileDownloadParams = {
  payload: any;
  userId: string;
  countryName?: string;
  isEnabled?: boolean;
};

export const useProfessionalProfileDownload = ({ payload, userId, countryName, isEnabled = true }: UseProfessionalProfileDownloadParams) => {
  const [isDownloadingProfile, setIsDownloadingProfile] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const personalData = payload?.profesional_data || {};
  const mainStudy = payload?.main_study || {};
  const speciality = payload?.study_specialization || [];
  const certifications = payload?.profesional_certifications || [];
  const experience = payload?.experience || [];
  const fullName = getFullName(personalData.name, personalData.last_name) || userId;
  const categoryName = useHandleCategoryName(mainStudy.sub_area);

  const sharedData = { personalData, mainStudy, speciality, certifications, experience };

  const handleDownloadProfilePdf = async () => {
    if (!isEnabled) {
      setDownloadError("No tienes permisos para descargar este perfil.");
      return;
    }

    setIsDownloadingPdf(true);
    setDownloadError(null);

    try {
      const attachments = collectAttachmentEntries(sharedData);
      const baseName = getBaseFileName(fullName);
      const [fullLogoDataUrl, compactLogoDataUrl] = await Promise.all([
        loadLogoDataUrl("/logos/Logo Arcidrade Full.png"),
        loadLogoDataUrl("/logos/Logo Arcidrade Cond.png"),
      ]);

      const doc = buildProfilePdf({
        payload, userId, fullName, categoryName,
        ...sharedData,
        attachments,
        fullLogoDataUrl,
        compactLogoDataUrl,
      });

      doc.save(`${baseName}.pdf`);
    } catch (error) {
      console.error("Error descargando PDF del perfil:", error);
      setDownloadError("No se pudo generar el PDF del perfil.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadProfile = async () => {
    if (!isEnabled) {
      setDownloadError("No tienes permisos para descargar este perfil.");
      return;
    }

    setIsDownloadingProfile(true);
    setDownloadError(null);

    try {
      const attachments = collectAttachmentEntries(sharedData);
      const { included, failed } = await packageAttachments(attachments);
      const workbook = createWorkbook({
        payload, userId, countryName, fullName, categoryName,
        ...sharedData,
        includedAttachments: included,
        failedAttachments: failed,
      });

      const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const baseName = getBaseFileName(fullName);
      const excelFileName = `${baseName}.xlsx`;

      if (included.length > 0) {
        const zip = new JSZip();
        zip.file(excelFileName, excelData);

        const attachmentsFolder = zip.folder("adjuntos");
        included.forEach((item) => {
          attachmentsFolder?.file(item.fileName, item.blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${baseName}.zip`);
      } else {
        const excelBlob = new Blob([excelData], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        downloadBlob(excelBlob, excelFileName);
      }
    } catch (error) {
      console.error("Error descargando perfil:", error);
      setDownloadError("No se pudo generar la descarga del perfil.");
    } finally {
      setIsDownloadingProfile(false);
    }
  };

  return {
    isDownloadingProfile,
    isDownloadingPdf,
    downloadError,
    handleDownloadProfile,
    handleDownloadProfilePdf,
  };
};
