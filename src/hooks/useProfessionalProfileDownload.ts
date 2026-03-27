'use client'

import { useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useHandleCategoryName } from "@/hooks/useUtils";

type AttachmentEntry = {
  section: string;
  label: string;
  url: string;
  sourceType: "file" | "link";
};

type PackagedAttachment = AttachmentEntry & {
  blob: Blob;
  fileName: string;
  packageStatus: "included";
};

type FailedAttachment = AttachmentEntry & {
  reason: string;
  packageStatus: "failed";
};

type UseProfessionalProfileDownloadParams = {
  payload: any;
  userId: string;
  countryName?: string;
  isEnabled?: boolean;
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const sanitizeValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "boolean") return value ? "Si" : "No";
  return String(value);
};

const sanitizeFileName = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

const getFullName = (name?: string | null, lastName?: string | null) => {
  return [name, lastName].filter(Boolean).join(" ").trim();
};

const getFileExtension = (url: string, mimeType?: string) => {
  try {
    const pathname = new URL(url).pathname;
    const candidate = pathname.split("/").pop() || "";
    if (candidate.includes(".")) {
      return candidate.split(".").pop()?.toLowerCase() || "";
    }
  } catch {
    // noop
  }

  const mimeMap: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
  };

  return mimeType ? mimeMap[mimeType] || "" : "";
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const appendSheet = (workbook: XLSX.WorkBook, name: string, rows: Array<Record<string, unknown>>, emptyMessage: string) => {
  const normalizedRows = rows.length > 0
    ? rows.map((row) => Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, sanitizeValue(value)])
      ))
    : [{ detalle: emptyMessage }];

  const worksheet = XLSX.utils.json_to_sheet(normalizedRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
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

  const handleStatusName = (status: string | undefined) => {
    if (status === "inProcess") {
      return "En Proceso";
    }

    if (status === "graduated") {
      return "Graduado";
    }

    return "No Registrado";
  };

  const collectAttachmentEntries = (): AttachmentEntry[] => {
    const attachments: AttachmentEntry[] = [];

    const pushAttachment = (section: string, label: string, url?: string | null, sourceType: "file" | "link" = "file") => {
      if (!url) return;
      attachments.push({ section, label, url, sourceType });
    };

    pushAttachment("Perfil", "Avatar", personalData.avatar, "file");
    pushAttachment("Perfil", "CV archivo", personalData.cv_file, "file");
    pushAttachment("Perfil", "CV link", personalData.cv_link, "link");
    pushAttachment("Titulo principal", "Archivo titulo principal", mainStudy.file, "file");
    pushAttachment("Titulo principal", "Link titulo principal", mainStudy.link, "link");

    speciality.forEach((item: any, index: number) => {
      const itemLabel = item.title || `especialidad-${index + 1}`;
      pushAttachment("Especialidades", `${itemLabel} archivo`, item.file, "file");
      pushAttachment("Especialidades", `${itemLabel} link`, item.link, "link");
    });

    certifications.forEach((item: any, index: number) => {
      const itemLabel = item.title || `certificacion-${index + 1}`;
      pushAttachment("Certificaciones", `${itemLabel} archivo`, item.file, "file");
      pushAttachment("Certificaciones", `${itemLabel} link`, item.link, "link");
    });

    experience.forEach((item: any, index: number) => {
      const itemLabel = item.title || `experiencia-${index + 1}`;
      pushAttachment("Experiencia", `${itemLabel} archivo`, item.file, "file");
      pushAttachment("Experiencia", `${itemLabel} link`, item.link, "link");
    });

    return attachments;
  };

  const packageAttachments = async (attachments: AttachmentEntry[]) => {
    const results = await Promise.all(attachments.map(async (attachment, index) => {
      try {
        const response = await fetch(attachment.url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const extension = getFileExtension(attachment.url, blob.type);
        const baseName = `${String(index + 1).padStart(2, "0")}-${sanitizeFileName(attachment.section)}-${sanitizeFileName(attachment.label)}`;
        const fileName = extension ? `${baseName}.${extension}` : baseName;

        return {
          ...attachment,
          blob,
          fileName,
          packageStatus: "included" as const,
        };
      } catch (error) {
        return {
          ...attachment,
          reason: error instanceof Error ? error.message : "No se pudo descargar el adjunto",
          packageStatus: "failed" as const,
        };
      }
    }));

    return {
      included: results.filter((item): item is PackagedAttachment => item.packageStatus === "included"),
      failed: results.filter((item): item is FailedAttachment => item.packageStatus === "failed"),
    };
  };

  const createWorkbook = (includedAttachments: PackagedAttachment[], failedAttachments: FailedAttachment[]) => {
    const workbook = XLSX.utils.book_new();

    appendSheet(workbook, "Resumen", [
      {
        referCode: sanitizeValue(payload?.referCode || userId),
        nombre_completo: fullName,
        email: sanitizeValue(payload?.email),
        estado_auth: sanitizeValue(payload?.status),
        categoria_profesional: categoryName,
        profesion_principal: sanitizeValue(mainStudy.title),
        homologado_ue: Boolean(mainStudy.isHomologated),
        total_especialidades: speciality.length,
        total_certificaciones: certifications.length,
        total_experiencias: experience.length,
      },
    ], "Sin resumen disponible");

    appendSheet(workbook, "Presentacion", [
      {
        nombre_completo: fullName,
        presentacion: sanitizeValue(personalData.description),
      },
    ], "Sin presentacion registrada");

    appendSheet(workbook, "Datos personales", [
      {
        referCode: sanitizeValue(payload?.referCode || userId),
        nombre: sanitizeValue(personalData.name),
        apellido: sanitizeValue(personalData.last_name),
        email: sanitizeValue(payload?.email),
        telefono: sanitizeValue(personalData.phone),
        fecha_nacimiento: formatDate(personalData.birth_date),
        pais: sanitizeValue(countryName),
        estado: sanitizeValue(personalData.state),
        ciudad: sanitizeValue(personalData.city),
        local_id: sanitizeValue(personalData.local_id),
        creado_el: formatDate(personalData.created_at),
        actualizado_el: formatDate(personalData.updated_at),
      },
    ], "Sin datos personales registrados");

    appendSheet(workbook, "CV y perfil", [
      {
        avatar: sanitizeValue(personalData.avatar),
        cv_link: sanitizeValue(personalData.cv_link),
        cv_archivo: sanitizeValue(personalData.cv_file),
      },
    ], "Sin archivos de perfil registrados");

    appendSheet(workbook, "Titulo principal", [
      {
        categoria_profesional: categoryName,
        titulo: sanitizeValue(mainStudy.title),
        institucion: sanitizeValue(mainStudy.institution),
        estado_estudio: handleStatusName(mainStudy.status),
        pais: sanitizeValue(mainStudy.country),
        fecha_inicio: formatDate(mainStudy.start_date),
        fecha_fin: formatDate(mainStudy.end_date),
        homologado_ue: Boolean(mainStudy.isHomologated),
        descripcion: sanitizeValue(mainStudy.description),
        archivo: sanitizeValue(mainStudy.file),
        link: sanitizeValue(mainStudy.link),
      },
    ], "Sin titulo principal registrado");

    appendSheet(workbook, "Especialidades", speciality.map((item: any) => ({
      titulo: sanitizeValue(item.title),
      categoria_titulo: sanitizeValue(item.title_category),
      categoria_profesional: sanitizeValue(item.sub_area ? useHandleCategoryName(item.sub_area) : ""),
      institucion: sanitizeValue(item.institution),
      estado: handleStatusName(item.status),
      pais: sanitizeValue(item.country),
      fecha_inicio: formatDate(item.start_date),
      fecha_fin: formatDate(item.end_date),
      es_principal: Boolean(item.is_main),
      homologado_ue: Boolean(item.isHomologated),
      descripcion: sanitizeValue(item.description),
      archivo: sanitizeValue(item.file),
      link: sanitizeValue(item.link),
    })), "Sin especialidades registradas");

    appendSheet(workbook, "Certificaciones", certifications.map((item: any) => ({
      titulo: sanitizeValue(item.title),
      institucion: sanitizeValue(item.institution),
      estado: handleStatusName(item.status),
      pais: sanitizeValue(item.country),
      fecha_inicio: formatDate(item.start_date),
      fecha_fin: formatDate(item.end_date),
      homologado_ue: Boolean(item.isHomologated),
      descripcion: sanitizeValue(item.description),
      archivo: sanitizeValue(item.file),
      link: sanitizeValue(item.link),
    })), "Sin certificaciones registradas");

    appendSheet(workbook, "Experiencia", experience.map((item: any) => ({
      titulo: sanitizeValue(item.title),
      institucion: sanitizeValue(item.institution),
      estado: sanitizeValue(item.status),
      pais: sanitizeValue(item.country),
      estado_region: sanitizeValue(item.state),
      ciudad: sanitizeValue(item.city),
      fecha_inicio: formatDate(item.start_date),
      fecha_fin: formatDate(item.end_date),
      descripcion: sanitizeValue(item.description),
      archivo: sanitizeValue(item.file),
      link: sanitizeValue(item.link),
    })), "Sin experiencia registrada");

    appendSheet(workbook, "Adjuntos", [
      ...includedAttachments.map((item) => ({
        seccion: item.section,
        etiqueta: item.label,
        origen: item.sourceType,
        url: item.url,
        empaquetado: "Incluido en zip",
        archivo_zip: item.fileName,
      })),
      ...failedAttachments.map((item) => ({
        seccion: item.section,
        etiqueta: item.label,
        origen: item.sourceType,
        url: item.url,
        empaquetado: "No incluido",
        detalle: item.reason,
      })),
    ], "Sin adjuntos registrados");

    return workbook;
  };

  const getBaseFileName = () => {
    const dateSuffix = new Date().toISOString().slice(0, 10);
    return sanitizeFileName(`perfil-${fullName}-${dateSuffix}`) || `perfil-${dateSuffix}`;
  };

  const loadLogoDataUrl = async (logoPath: string) => {
    try {
      const response = await fetch(logoPath);
      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();
      return await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleDownloadProfilePdf = async () => {
    if (!isEnabled) {
      setDownloadError("No tienes permisos para descargar este perfil.");
      return;
    }

    setIsDownloadingPdf(true);
    setDownloadError(null);

    try {
      const attachments = collectAttachmentEntries();
      const baseName = getBaseFileName();
      const [fullLogoDataUrl, compactLogoDataUrl] = await Promise.all([
        loadLogoDataUrl("/logos/Logo Arcidrade Full.png"),
        loadLogoDataUrl("/logos/Logo Arcidrade Cond.png"),
      ]);
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 32;
      const brandColor: [number, number, number] = [34, 82, 135];
      const neutralColor: [number, number, number] = [90, 90, 90];
      const coverHeaderHeight = 74;
      const internalHeaderHeight = 42;
      const footerHeight = 24;
      const bottomSafeY = pageHeight - footerHeight - 16;
      const topSafeY = internalHeaderHeight + 18;
      let cursorY = 0;

      const drawCoverHeader = () => {
        doc.setFillColor(...brandColor);
        doc.rect(0, 0, pageWidth, coverHeaderHeight, "F");

        if (fullLogoDataUrl) {
          doc.addImage(fullLogoDataUrl, "PNG", marginX, 10, 96, 54);
        } else if (compactLogoDataUrl) {
          doc.addImage(compactLogoDataUrl, "PNG", marginX, 16, 40, 40);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Perfil profesional", marginX + 112, 34);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`ReferCode: ${sanitizeValue(payload?.referCode || userId)}`, marginX + 112, 50);
        doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, marginX + 112, 64);
      };

      const drawInternalHeader = () => {
        doc.setFillColor(...brandColor);
        doc.rect(0, 0, pageWidth, internalHeaderHeight, "F");

        if (compactLogoDataUrl) {
          doc.addImage(compactLogoDataUrl, "PNG", marginX, 8, 22, 22);
        }

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Perfil profesional", marginX + 28, 24);
      };

      const ensureRoom = (neededHeight: number) => {
        if (cursorY + neededHeight <= bottomSafeY) {
          return;
        }

        doc.addPage();
        drawInternalHeader();
        cursorY = topSafeY;
      };

      const drawSectionTitle = (title: string) => {
        ensureRoom(46);
        doc.setTextColor(...brandColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(title, marginX, cursorY);
        cursorY += 14;
      };

      const sectionTableConfig = {
        margin: { left: marginX, right: marginX, top: topSafeY, bottom: footerHeight + 12 },
        theme: "grid" as const,
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" as const, textColor: [40, 40, 40] as [number, number, number] },
        headStyles: { fillColor: brandColor, textColor: [255, 255, 255] as [number, number, number] },
        alternateRowStyles: { fillColor: [247, 249, 252] as [number, number, number] },
      };

      const addSection = (title: string, rows: Array<[string, string]>) => {
        drawSectionTitle(title);
        autoTable(doc, {
          startY: cursorY,
          head: [["Campo", "Valor"]],
          body: rows.map(([label, value]) => [label, value || "-"]),
          ...sectionTableConfig,
          styles: { ...sectionTableConfig.styles, fontSize: 9, cellPadding: 5 },
        });
        cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;
      };

      drawCoverHeader();

      doc.setTextColor(...brandColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(fullName, marginX, coverHeaderHeight + 30);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...neutralColor);
      doc.text(`Email: ${sanitizeValue(payload?.email)}`, marginX, coverHeaderHeight + 46);
      doc.text(`Profesion principal: ${sanitizeValue(mainStudy.title) || "No registrada"}`, marginX, coverHeaderHeight + 60);
      doc.text(`Categoria: ${categoryName}`, marginX, coverHeaderHeight + 74);

      cursorY = coverHeaderHeight + 88;

      autoTable(doc, {
        startY: cursorY,
        head: [["Resumen", "Valor"]],
        body: [
          ["Nombre", fullName],
          ["Email", sanitizeValue(payload?.email)],
          ["Estado auth", sanitizeValue(payload?.status)],
          ["Categoria profesional", categoryName],
          ["Profesion principal", sanitizeValue(mainStudy.title)],
          ["Homologado UE", sanitizeValue(Boolean(mainStudy.isHomologated))],
          ["Total especialidades", sanitizeValue(speciality.length)],
          ["Total certificaciones", sanitizeValue(certifications.length)],
          ["Total experiencias", sanitizeValue(experience.length)],
        ],
        ...sectionTableConfig,
        styles: { ...sectionTableConfig.styles, fontSize: 9, cellPadding: 5 },
      });
      cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

      addSection("Datos personales", [
        ["Nombre", sanitizeValue(personalData.name)],
        ["Apellido", sanitizeValue(personalData.last_name)],
        ["Telefono", sanitizeValue(personalData.phone)],
        ["Fecha nacimiento", formatDate(personalData.birth_date)],
        ["Pais", sanitizeValue(countryName)],
        ["Estado", sanitizeValue(personalData.state)],
        ["Ciudad", sanitizeValue(personalData.city)],
      ]);

      addSection("Titulo principal", [
        ["Categoria", categoryName],
        ["Titulo", sanitizeValue(mainStudy.title)],
        ["Institucion", sanitizeValue(mainStudy.institution)],
        ["Estado estudio", handleStatusName(mainStudy.status)],
        ["Pais", sanitizeValue(mainStudy.country)],
        ["Fecha inicio", formatDate(mainStudy.start_date)],
        ["Fecha fin", formatDate(mainStudy.end_date)],
      ]);

      drawSectionTitle("Especialidades");
      autoTable(doc, {
        startY: cursorY,
        head: [["Especialidades", "Institucion", "Estado", "Fin", "Homologado"]],
        body: speciality.length > 0
          ? speciality.map((item: any) => ([
              sanitizeValue(item.title),
              sanitizeValue(item.institution),
              handleStatusName(item.status),
              formatDate(item.end_date),
              sanitizeValue(Boolean(item.isHomologated)),
            ]))
          : [["Sin especialidades", "-", "-", "-", "-"]],
        ...sectionTableConfig,
      });
      cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

      drawSectionTitle("Certificaciones");
      autoTable(doc, {
        startY: cursorY,
        head: [["Certificaciones", "Institucion", "Estado", "Fin", "Homologado"]],
        body: certifications.length > 0
          ? certifications.map((item: any) => ([
              sanitizeValue(item.title),
              sanitizeValue(item.institution),
              handleStatusName(item.status),
              formatDate(item.end_date),
              sanitizeValue(Boolean(item.isHomologated)),
            ]))
          : [["Sin certificaciones", "-", "-", "-", "-"]],
        ...sectionTableConfig,
      });
      cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

      drawSectionTitle("Experiencia");
      autoTable(doc, {
        startY: cursorY,
        head: [["Experiencia", "Institucion", "Ciudad", "Inicio", "Fin"]],
        body: experience.length > 0
          ? experience.map((item: any) => ([
              sanitizeValue(item.title),
              sanitizeValue(item.institution),
              sanitizeValue(item.city),
              formatDate(item.start_date),
              formatDate(item.end_date),
            ]))
          : [["Sin experiencia", "-", "-", "-", "-"]],
        ...sectionTableConfig,
      });
      cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

      drawSectionTitle("Adjuntos y enlaces");
      autoTable(doc, {
        startY: cursorY,
        head: [["Adjunto", "Seccion", "Origen", "URL"]],
        body: attachments.length > 0
          ? attachments.map((item) => ([item.label, item.section, item.sourceType, item.url]))
          : [["Sin adjuntos", "-", "-", "-"]],
        ...sectionTableConfig,
      });
      cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

      const totalPages = doc.getNumberOfPages();
      for (let page = 1; page <= totalPages; page += 1) {
        doc.setPage(page);
        if (page > 1) {
          drawInternalHeader();
        }

        doc.setDrawColor(215, 221, 228);
        doc.line(marginX, pageHeight - footerHeight - 2, pageWidth - marginX, pageHeight - footerHeight - 2);
        doc.setTextColor(...neutralColor);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Documento generado por Arcidrade`, marginX, pageHeight - 10);
        doc.text(`Pagina ${page} de ${totalPages}`, pageWidth - marginX, pageHeight - 10, { align: "right" });
      }

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
      const attachments = collectAttachmentEntries();
      const { included, failed } = await packageAttachments(attachments);
      const workbook = createWorkbook(included, failed);
      const excelData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const baseName = getBaseFileName();
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