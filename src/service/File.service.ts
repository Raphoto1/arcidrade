import { put, del } from "@vercel/blob";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_BYTES = 4.5 * 1024 * 1024; // 4.5MB — límite real de subida
const ALLOWED_FOLDERS = ["avatar", "cv", "mainStudy", "specialization", "certification", "goal"];

const ALLOWED_TYPES: Record<string, { mimeTypes: string[]; extensions: string[]; maxBytes: number }> = Object.fromEntries(
  ALLOWED_FOLDERS.map((folder) => [folder, { mimeTypes: ALLOWED_MIME_TYPES, extensions: ALLOWED_EXTENSIONS, maxBytes: MAX_BYTES }])
);

export const validateFile = (file: File, folder: string): void => {
  const rules = ALLOWED_TYPES[folder];
  if (!rules) throw new Error(`Carpeta de upload no permitida: ${folder}`);

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const mime = file.type.toLowerCase();

  if (!rules.mimeTypes.includes(mime)) {
    throw new Error(`Tipo de archivo no permitido. Se esperaba: ${rules.mimeTypes.join(", ")}`);
  }
  if (!rules.extensions.includes(ext)) {
    throw new Error(`Extensión de archivo no permitida. Se esperaba: ${rules.extensions.join(", ")}`);
  }
  if (file.size > rules.maxBytes) {
    throw new Error(`El archivo supera el tamaño máximo permitido de ${rules.maxBytes / 1024 / 1024}MB`);
  }
};

export const uploadFileService = async (file: File, folder: string, user_id: String | null | undefined) => {
  validateFile(file, folder);

  const blob = await put(`usersData/${user_id}/${folder}/${file.name}`, file, {
    access: "public", // cambiar a "private" una vez el store esté configurado como privado en Vercel
    addRandomSuffix: true,
  });

  return blob;
};

export const deleteFileService = async (fileUrl: string) => {
  const deleteBlob = await del(fileUrl);
  return deleteBlob;
};
