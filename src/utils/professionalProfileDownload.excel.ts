import * as XLSX from "xlsx";
import { useHandleCategoryName } from "@/hooks/useUtils";
import {
  sanitizeValue,
  formatDate,
  handleStatusName,
  appendSheet,
  type PackagedAttachment,
  type FailedAttachment,
} from "./professionalProfileDownload.shared";

// ─── Workbook builder ─────────────────────────────────────────────────────────

type CreateWorkbookParams = {
  payload: any;
  userId: string;
  countryName?: string;
  fullName: string;
  categoryName: string;
  personalData: any;
  mainStudy: any;
  speciality: any[];
  certifications: any[];
  experience: any[];
  extraData?: any;
  includedAttachments: PackagedAttachment[];
  failedAttachments: FailedAttachment[];
};

export const createWorkbook = ({
  payload,
  userId,
  countryName,
  fullName,
  categoryName,
  personalData,
  mainStudy,
  speciality,
  certifications,
  experience,
  extraData = {},
  includedAttachments,
  failedAttachments,
}: CreateWorkbookParams): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();

  appendSheet(workbook, "Resumen", [{
    referCode: sanitizeValue(payload?.referCode || userId),
    nombre_completo: fullName,
    email: sanitizeValue(payload?.email),
    estado_auth: sanitizeValue(payload?.status),
    categoria_profesional: categoryName,
    profesion_principal: sanitizeValue(mainStudy.title),
    homologado_ue: Boolean(mainStudy.isHomologated),
    documentacion_europea: Boolean(extraData.has_european_docs),
    requiere_sponsor: Boolean(extraData.needs_sponsor),
    total_especialidades: speciality.length,
    total_certificaciones: certifications.length,
    total_experiencias: experience.length,
  }], "Sin resumen disponible");

  appendSheet(workbook, "Presentacion", [{
    nombre_completo: fullName,
    presentacion: sanitizeValue(personalData.description),
  }], "Sin presentacion registrada");

  appendSheet(workbook, "Datos personales", [{
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
  }], "Sin datos personales registrados");

  appendSheet(workbook, "CV y perfil", [{
    avatar: sanitizeValue(personalData.avatar),
    cv_link: sanitizeValue(personalData.cv_link),
    cv_archivo: sanitizeValue(personalData.cv_file),
  }], "Sin archivos de perfil registrados");

  appendSheet(workbook, "Titulo principal", [{
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
  }], "Sin titulo principal registrado");

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
