import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  sanitizeValue,
  formatDate,
  handleStatusName,
  type AttachmentEntry,
} from "./professionalProfileDownload.shared";

// ─── PDF builder ──────────────────────────────────────────────────────────────

type BuildProfilePdfParams = {
  payload: any;
  userId: string;
  fullName: string;
  categoryName: string;
  personalData: any;
  mainStudy: any;
  speciality: any[];
  certifications: any[];
  experience: any[];
  attachments: AttachmentEntry[];
  fullLogoDataUrl: string | null;
  compactLogoDataUrl: string | null;
};

export const buildProfilePdf = ({
  payload,
  userId,
  fullName,
  categoryName,
  personalData,
  mainStudy,
  speciality,
  certifications,
  experience,
  attachments,
  fullLogoDataUrl,
  compactLogoDataUrl,
}: BuildProfilePdfParams): jsPDF => {
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
    if (cursorY + neededHeight <= bottomSafeY) return;
    doc.addPage();
    drawInternalHeader();
    cursorY = topSafeY;
  };

  const sectionTableConfig = {
    margin: { left: marginX, right: marginX, top: topSafeY, bottom: footerHeight + 12 },
    theme: "grid" as const,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak" as const,
      textColor: [40, 40, 40] as [number, number, number],
    },
    headStyles: { fillColor: brandColor, textColor: [255, 255, 255] as [number, number, number] },
    alternateRowStyles: { fillColor: [247, 249, 252] as [number, number, number] },
  };

  const drawSectionTitle = (title: string) => {
    ensureRoom(46);
    doc.setTextColor(...brandColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(title, marginX, cursorY);
    cursorY += 14;
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

  // Cover page
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
    ["Pais", sanitizeValue(personalData.country)],
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
      ? speciality.map((item: any) => [
          sanitizeValue(item.title),
          sanitizeValue(item.institution),
          handleStatusName(item.status),
          formatDate(item.end_date),
          sanitizeValue(Boolean(item.isHomologated)),
        ])
      : [["Sin especialidades", "-", "-", "-", "-"]],
    ...sectionTableConfig,
  });
  cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

  drawSectionTitle("Certificaciones");
  autoTable(doc, {
    startY: cursorY,
    head: [["Certificaciones", "Institucion", "Estado", "Fin", "Homologado"]],
    body: certifications.length > 0
      ? certifications.map((item: any) => [
          sanitizeValue(item.title),
          sanitizeValue(item.institution),
          handleStatusName(item.status),
          formatDate(item.end_date),
          sanitizeValue(Boolean(item.isHomologated)),
        ])
      : [["Sin certificaciones", "-", "-", "-", "-"]],
    ...sectionTableConfig,
  });
  cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

  drawSectionTitle("Experiencia");
  autoTable(doc, {
    startY: cursorY,
    head: [["Experiencia", "Institucion", "Ciudad", "Inicio", "Fin"]],
    body: experience.length > 0
      ? experience.map((item: any) => [
          sanitizeValue(item.title),
          sanitizeValue(item.institution),
          sanitizeValue(item.city),
          formatDate(item.start_date),
          formatDate(item.end_date),
        ])
      : [["Sin experiencia", "-", "-", "-", "-"]],
    ...sectionTableConfig,
  });
  cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

  drawSectionTitle("Adjuntos y enlaces");
  autoTable(doc, {
    startY: cursorY,
    head: [["Adjunto", "Seccion", "Origen", "URL"]],
    body: attachments.length > 0
      ? attachments.map((item) => [item.label, item.section, item.sourceType, item.url])
      : [["Sin adjuntos", "-", "-", "-"]],
    ...sectionTableConfig,
  });
  cursorY = ((doc as any).lastAutoTable?.finalY || cursorY) + 14;

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    if (page > 1) drawInternalHeader();

    doc.setDrawColor(215, 221, 228);
    doc.line(marginX, pageHeight - footerHeight - 2, pageWidth - marginX, pageHeight - footerHeight - 2);
    doc.setTextColor(...neutralColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Documento generado por Arcidrade", marginX, pageHeight - 10);
    doc.text(`Pagina ${page} de ${totalPages}`, pageWidth - marginX, pageHeight - 10, { align: "right" });
  }

  return doc;
};
