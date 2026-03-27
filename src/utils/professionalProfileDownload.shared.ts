import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttachmentEntry = {
  section: string;
  label: string;
  url: string;
  sourceType: "file" | "link";
};

export type PackagedAttachment = AttachmentEntry & {
  blob: Blob;
  fileName: string;
  packageStatus: "included";
};

export type FailedAttachment = AttachmentEntry & {
  reason: string;
  packageStatus: "failed";
};

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export const formatDate = (value?: string | Date | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const sanitizeValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "boolean") return value ? "Si" : "No";
  return String(value);
};

export const sanitizeFileName = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

export const getFullName = (name?: string | null, lastName?: string | null) => {
  return [name, lastName].filter(Boolean).join(" ").trim();
};

export const getFileExtension = (url: string, mimeType?: string) => {
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

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const handleStatusName = (status: string | undefined) => {
  if (status === "inProcess") return "En Proceso";
  if (status === "graduated") return "Graduado";
  return "No Registrado";
};

export const getBaseFileName = (fullName: string) => {
  const dateSuffix = new Date().toISOString().slice(0, 10);
  return sanitizeFileName(`perfil-${fullName}-${dateSuffix}`) || `perfil-${dateSuffix}`;
};

export const loadLogoDataUrl = async (logoPath: string): Promise<string | null> => {
  try {
    const response = await fetch(logoPath);
    if (!response.ok) return null;

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

// ─── Attachment helpers ───────────────────────────────────────────────────────

type CollectAttachmentsData = {
  personalData: any;
  mainStudy: any;
  speciality: any[];
  certifications: any[];
  experience: any[];
};

export const collectAttachmentEntries = ({
  personalData,
  mainStudy,
  speciality,
  certifications,
  experience,
}: CollectAttachmentsData): AttachmentEntry[] => {
  const attachments: AttachmentEntry[] = [];

  const push = (section: string, label: string, url?: string | null, sourceType: "file" | "link" = "file") => {
    if (!url) return;
    attachments.push({ section, label, url, sourceType });
  };

  push("Perfil", "Avatar", personalData.avatar, "file");
  push("Perfil", "CV archivo", personalData.cv_file, "file");
  push("Perfil", "CV link", personalData.cv_link, "link");
  push("Titulo principal", "Archivo titulo principal", mainStudy.file, "file");
  push("Titulo principal", "Link titulo principal", mainStudy.link, "link");

  speciality.forEach((item: any, index: number) => {
    const label = item.title || `especialidad-${index + 1}`;
    push("Especialidades", `${label} archivo`, item.file, "file");
    push("Especialidades", `${label} link`, item.link, "link");
  });

  certifications.forEach((item: any, index: number) => {
    const label = item.title || `certificacion-${index + 1}`;
    push("Certificaciones", `${label} archivo`, item.file, "file");
    push("Certificaciones", `${label} link`, item.link, "link");
  });

  experience.forEach((item: any, index: number) => {
    const label = item.title || `experiencia-${index + 1}`;
    push("Experiencia", `${label} archivo`, item.file, "file");
    push("Experiencia", `${label} link`, item.link, "link");
  });

  return attachments;
};

export const packageAttachments = async (attachments: AttachmentEntry[]) => {
  const results = await Promise.all(
    attachments.map(async (attachment, index) => {
      try {
        const response = await fetch(attachment.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const extension = getFileExtension(attachment.url, blob.type);
        const baseName = `${String(index + 1).padStart(2, "0")}-${sanitizeFileName(attachment.section)}-${sanitizeFileName(attachment.label)}`;
        const fileName = extension ? `${baseName}.${extension}` : baseName;

        return { ...attachment, blob, fileName, packageStatus: "included" as const };
      } catch (error) {
        return {
          ...attachment,
          reason: error instanceof Error ? error.message : "No se pudo descargar el adjunto",
          packageStatus: "failed" as const,
        };
      }
    }),
  );

  return {
    included: results.filter((item): item is PackagedAttachment => item.packageStatus === "included"),
    failed: results.filter((item): item is FailedAttachment => item.packageStatus === "failed"),
  };
};

// ─── XLSX helpers ─────────────────────────────────────────────────────────────

export const appendSheet = (
  workbook: XLSX.WorkBook,
  name: string,
  rows: Array<Record<string, unknown>>,
  emptyMessage: string,
) => {
  const normalizedRows =
    rows.length > 0
      ? rows.map((row) =>
          Object.fromEntries(
            Object.entries(row).map(([key, value]) => [key, sanitizeValue(value)]),
          ),
        )
      : [{ detalle: emptyMessage }];

  const worksheet = XLSX.utils.json_to_sheet(normalizedRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
};
