'use client';

import React, { useMemo, useState } from "react";
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

type InstitutionRef = {
  referCode?: string;
};

type InstitutionPayload = {
  referCode?: string;
  email?: string;
  status?: string;
  institution_data?: {
    user_id?: string;
    name?: string;
    fake_name?: string;
    country?: string;
    state?: string;
    city?: string;
    phone?: string;
    website?: string;
    main_speciality?: string;
    company_id?: string;
    status?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
  };
};

type ExportInstitutionsExcelFormProps = {
  institutions: InstitutionRef[];
  categoryLabel: string;
  fileBaseName: string;
  status: string;
};

export default function ExportInstitutionsExcelForm({
  institutions,
  categoryLabel,
  fileBaseName,
  status,
}: ExportInstitutionsExcelFormProps) {
  const { closeModal } = useModal();
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const referCodes = useMemo(
    () => institutions.map((institution) => institution.referCode).filter((code): code is string => Boolean(code)),
    [institutions]
  );

  const fetchPage = async (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: "50",
      status,
    });
    const response = await fetch(`/api/platform/institution/paginated?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Error al cargar instituciones");
    }
    return response.json();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const firstPage = await fetchPage(1);
      const totalPages = Number(firstPage?.totalPages || 1);
      const collectedCodes = new Set<string>();

      if (Array.isArray(firstPage?.data)) {
        firstPage.data.forEach((item: InstitutionRef) => {
          if (item?.referCode) {
            collectedCodes.add(item.referCode);
          }
        });
      }

      for (let page = 2; page <= totalPages; page += 1) {
        const pageData = await fetchPage(page);
        if (Array.isArray(pageData?.data)) {
          pageData.data.forEach((item: InstitutionRef) => {
            if (item?.referCode) {
              collectedCodes.add(item.referCode);
            }
          });
        }
      }

      if (collectedCodes.size === 0) {
        setErrorMessage("No hay instituciones para exportar.");
        return;
      }

      const responses = await Promise.all(
        Array.from(collectedCodes).map(async (code) => {
          const response = await fetch(`/api/platform/institution/complete/${code}`);
          if (!response.ok) {
            throw new Error(`Error al cargar institucion ${code}`);
          }
          const data = await response.json();
          return data?.payload as InstitutionPayload;
        })
      );

      const rows = responses.map((institution) => ({
        categoria: categoryLabel,
        referCode: sanitizeValue(institution?.institution_data?.user_id || institution?.referCode),
        nombre: sanitizeValue(institution?.institution_data?.name),
        fake_name: sanitizeValue(institution?.institution_data?.fake_name),
        email: sanitizeValue(institution?.email),
        pais: sanitizeValue(institution?.institution_data?.country),
        estado: sanitizeValue(institution?.institution_data?.state),
        ciudad: sanitizeValue(institution?.institution_data?.city),
        telefono: sanitizeValue(institution?.institution_data?.phone),
        sitio_web: sanitizeValue(institution?.institution_data?.website),
        especialidad_principal: sanitizeValue(institution?.institution_data?.main_speciality),
        company_id: sanitizeValue(institution?.institution_data?.company_id),
        estado_auth: sanitizeValue(institution?.status),
        estado_institucion: sanitizeValue(institution?.institution_data?.status),
        creado_el: formatDate(institution?.institution_data?.created_at),
        actualizado_el: formatDate(institution?.institution_data?.updated_at),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Instituciones");

      const today = new Date().toISOString().slice(0, 10);
      const fileName = `${fileBaseName}-${today}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      closeModal();
    } catch (error) {
      console.error("Error exportando instituciones:", error);
      setErrorMessage("No se pudo generar el Excel. Intenta nuevamente.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-gray-600">
        {referCodes.length === 0
          ? "No hay instituciones para exportar."
          : `Se exportaran ${referCodes.length} instituciones (${categoryLabel}).`}
      </div>

      {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}

      <button
        type="button"
        className="btn bg-(--main-arci) hover:bg-(--main-arci)/90 text-white"
        onClick={handleExport}
        disabled={isExporting || referCodes.length === 0}
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
