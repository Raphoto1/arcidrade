'use client';

import React, { useState } from "react";
import * as XLSX from "xlsx";

import { useModal } from "@/context/ModalContext";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const sanitizeValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  return String(value);
};

type ProfesionalPayload = {
  referCode?: string;
  email?: string;
  status?: string;
  profesional_data?: {
    name?: string;
    last_name?: string;
    fake_name?: string;
    phone?: string;
    city?: string;
    country?: string;
    state?: string;
    birth_date?: string | Date;
    created_at?: string | Date;
    updated_at?: string | Date;
  };
  main_study?: {
    title?: string;
    institution?: string;
    status?: string;
    sub_area?: string;
  };
  study_specialization?: Array<{
    title?: string;
    title_category?: string;
    institution?: string;
  }>;
};

type ExportProfesionalsExcelFormProps = {
  categoryLabel: string;
  fileBaseName: string;
  status: string;
};

export default function ExportProfesionalsExcelForm({
  categoryLabel,
  fileBaseName,
  status,
}: ExportProfesionalsExcelFormProps) {
  const { closeModal } = useModal();
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPage = async (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "50",
      status,
    });
    const response = await fetch(`/api/platform/profesional/paginated?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Error al cargar profesionales");
    }
    return response.json();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const firstPage = await fetchPage(1);
      const totalPages = Number(firstPage?.totalPages || 1);
      const allProfesionals: ProfesionalPayload[] = Array.isArray(firstPage?.data) ? firstPage.data : [];

      for (let page = 2; page <= totalPages; page += 1) {
        const pageData = await fetchPage(page);
        if (Array.isArray(pageData?.data)) {
          allProfesionals.push(...pageData.data);
        }
      }

      if (allProfesionals.length === 0) {
        setErrorMessage("No hay profesionales para exportar.");
        return;
      }

      const rows = allProfesionals.map((profesional) => {
        const profesionalData = profesional.profesional_data || {};
        const mainStudy = profesional.main_study || {};
        const specialization = profesional.study_specialization?.[0] || {};

        return {
          categoria: categoryLabel,
          referCode: sanitizeValue(profesional.referCode),
          nombre: sanitizeValue(profesionalData.name),
          apellido: sanitizeValue(profesionalData.last_name),
          fake_name: sanitizeValue(profesionalData.fake_name),
          email: sanitizeValue(profesional.email),
          telefono: sanitizeValue(profesionalData.phone),
          pais: sanitizeValue(profesionalData.country),
          estado: sanitizeValue(profesionalData.state),
          ciudad: sanitizeValue(profesionalData.city),
          fecha_nacimiento: formatDate(profesionalData.birth_date),
          categoria_profesional: sanitizeValue(mainStudy.sub_area),
          especialidad: sanitizeValue(specialization.title || mainStudy.title),
          institucion: sanitizeValue(specialization.institution || mainStudy.institution),
          estado_estudios: sanitizeValue(mainStudy.status),
          estado_auth: sanitizeValue(profesional.status),
          creado_el: formatDate(profesionalData.created_at),
          actualizado_el: formatDate(profesionalData.updated_at),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Profesionales");

      const today = new Date().toISOString().slice(0, 10);
      const fileName = `${fileBaseName}-${today}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      closeModal();
    } catch (error) {
      console.error("Error exportando profesionales:", error);
      setErrorMessage("No se pudo generar el Excel. Intenta nuevamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600">
        Exporta todos los profesionales de la categoria {categoryLabel}.
      </div>

      {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

      <button
        type="button"
        className="btn bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Exportar Excel"
        )}
      </button>
    </div>
  );
}
