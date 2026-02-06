import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { useModal } from "@/context/ModalContext";
import { formatDateToString } from "@/hooks/useUtils";

export default function ExportProcessExcelForm(props: any) {
  const { closeModal } = useModal();
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processData = props.processData;
  const institutionData = props.institutionData;
  const profesionals = props.profesionals || [];
  const profesionalsArci = props.profesionalsArci || [];

  const fileName = useMemo(() => {
    const baseName = (props.fileBaseName || processData?.position || "proceso").toString();
    const normalized = baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "_")
      .replace(/^_+|_+$/g, "");
    const safeBase = normalized.length > 0 ? normalized : "proceso";
    return `${safeBase}.xlsx`;
  }, [processData?.position, props.fileBaseName]);

  const formatDate = (value?: string | number | Date | null) => {
    if (!value) return "";
    try {
      return formatDateToString(value);
    } catch (error) {
      return "";
    }
  };

  const buildProcessSheet = () => {
    return [
      {
        "Id Proceso": processData?.id ?? "",
        Cliente: institutionData?.name ?? "",
        Puesto: processData?.position ?? "",
        Estado: processData?.status ?? "",
        Tipo: processData?.type ?? "",
        Categoria: processData?.area ?? "",
        "Especialidad Principal": processData?.main_speciality ?? "",
        "Especialidades Secundarias": Array.isArray(processData?.extra_specialities)
          ? processData.extra_specialities.map((spec: any) => spec?.speciality).filter(Boolean).join(", ")
          : "",
        "Fecha Inicio": formatDate(processData?.start_date),
        "Fecha Aprobacion": formatDate(processData?.approval_date),
        "Fecha Fin": formatDate(processData?.end_date),
        Descripcion: processData?.description ?? "",
      },
    ];
  };

  const fetchProfesionalDetails = async (profesionalId: string) => {
    try {
      const response = await fetch(`/api/platform/profesional/${profesionalId}`);
      if (!response.ok) return null;
      const result = await response.json();
      return result?.payload || null;
    } catch (error) {
      return null;
    }
  };

  const buildCandidateRow = (profesionalListed: any, payload: any, groupLabel: string) => {
    const profesionalData = payload?.profesional_data || {};
    const mainStudy = payload?.main_study || {};
    const fullName = [profesionalData?.name, profesionalData?.last_name].filter(Boolean).join(" ");

    return {
      Grupo: groupLabel,
      "Profesional Id": profesionalListed?.profesional_id ?? "",
      Nombre: fullName || profesionalData?.fake_name || "",
      Email: payload?.email ?? "",
      Telefono: profesionalData?.phone ?? "",
      Pais: profesionalData?.country ?? "",
      Ciudad: profesionalData?.city ?? "",
      "Estado Proceso": profesionalListed?.process_status ?? "",
      "Agregado Por": profesionalListed?.added_by ?? "",
      "Es Arcidrade": profesionalListed?.is_arcidrade ? "si" : "no",
      Feedback: profesionalListed?.feedback ?? "",
      "Fecha Agregado": formatDate(profesionalListed?.created_at),
      "Estudio Principal": mainStudy?.title ?? "",
      "Estado Estudio": mainStudy?.status ?? "",
    };
  };

  const buildCandidatesSheet = async () => {
    const allCandidates = [
      ...profesionals.map((item: any) => ({ item, group: "Institucion" })),
      ...profesionalsArci.map((item: any) => ({ item, group: "Arcidrade" })),
    ];

    if (allCandidates.length === 0) {
      const headers = [
        "Grupo",
        "Profesional Id",
        "Nombre",
        "Email",
        "Telefono",
        "Pais",
        "Ciudad",
        "Estado Proceso",
        "Agregado Por",
        "Es Arcidrade",
        "Feedback",
        "Fecha Agregado",
        "Estudio Principal",
        "Estado Estudio",
      ];
      const emptySheet = XLSX.utils.json_to_sheet([], { header: headers });
      XLSX.utils.sheet_add_aoa(emptySheet, [headers], { origin: "A1" });
      return emptySheet;
    }

    const rows = await Promise.all(
      allCandidates.map(async ({ item, group }) => {
        const payload = await fetchProfesionalDetails(item?.profesional_id);
        return buildCandidateRow(item, payload, group);
      })
    );

    return XLSX.utils.json_to_sheet(rows);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const workbook = XLSX.utils.book_new();
      const processSheet = XLSX.utils.json_to_sheet(buildProcessSheet());
      XLSX.utils.book_append_sheet(workbook, processSheet, "Proceso");

      const candidatesSheet = await buildCandidatesSheet();
      XLSX.utils.book_append_sheet(workbook, candidatesSheet, "Candidatos");

      XLSX.writeFile(workbook, fileName);
      closeModal();
    } catch (error) {
      setErrorMessage("No se pudo generar el archivo. Intenta de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
      <h1 className="text-2xl fontArci text-center text-[var(--main-arci)]">Exportar proceso</h1>
      <p className="text-sm text-gray-600 text-center">
        Se descargara un Excel con el detalle del proceso y los candidatos seleccionados.
      </p>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Proceso:</span>
          <span>{processData?.position || "Sin titulo"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Cliente:</span>
          <span>{institutionData?.name || "Sin cliente"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Candidatos:</span>
          <span>{profesionals.length + profesionalsArci.length}</span>
        </div>
      </div>

      {errorMessage && <p className="text-sm text-red-600 text-center">{errorMessage}</p>}

      <div className="flex gap-3">
        <button className="btn btn-outline flex-1" onClick={closeModal} disabled={isExporting}>
          Cancelar
        </button>
        <button
          className="btn bg-[var(--main-arci)] hover:bg-[var(--main-arci)]/90 text-white flex-1 disabled:opacity-60"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Generando...
            </span>
          ) : (
            "Exportar Excel"
          )}
        </button>
      </div>
    </div>
  );
}
