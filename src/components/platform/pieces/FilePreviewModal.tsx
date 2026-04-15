"use client";
import React, { useRef, useState, useEffect } from "react";
import { IoDocumentAttachOutline, IoDownloadOutline, IoOpenOutline } from "react-icons/io5";

interface FilePreviewModalProps {
  url: string;
  label?: string;
  btnClassName?: string;
}

function detectFileType(url: string): "pdf" | "image" | "other" {
  const lower = url.toLowerCase().split("?")[0];
  if (lower.endsWith(".pdf")) return "pdf";
  if (/\.(jpe?g|png|webp|gif|svg)$/.test(lower)) return "image";
  // Fallback: si la carpeta es /cv/ o /mainStudy/ asumir PDF
  if (/\/(cv|mainstudy|specialization|certification)\//.test(lower)) return "pdf";
  return "other";
}

export default function FilePreviewModal({ url, label = "Ver archivo", btnClassName }: FilePreviewModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  if (!url) return null;

  const type = detectFileType(url);

  // Legacy = subido como public (URL pública del CDN)
  // Private = nuevo, pasa por proxy
  const isPrivateBlob =
    url.includes(".blob.vercel-storage.com/") &&
    !url.includes(".public.blob.vercel-storage.com/");

  const handleOpen = async () => {
    modalRef.current?.showModal();
    // Solo fetchear si es PDF y no tenemos blob aún
    if (type !== "pdf" || blobUrl || fetchError) return;
    setLoading(true);
    try {
      const fetchUrl = isPrivateBlob
        ? `/api/platform/files?url=${encodeURIComponent(url)}`
        : url;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      setBlobUrl(URL.createObjectURL(blob));
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar el object URL al desmontar
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return (
    <div>
      <button
        className={btnClassName || "btn btn-sm bg-(--soft-arci) h-auto w-auto p-1 min-w-full"}
        onClick={handleOpen}
      >
        <span className="flex items-center justify-center gap-2">
          <IoDocumentAttachOutline size={16} />
          {label}
        </span>
      </button>

      <dialog
        ref={modalRef}
        className="modal px-2 py-2 sm:px-4"
        onClick={(e) => e.target === e.currentTarget && modalRef.current?.close()}
      >
        <div className="modal-box relative w-full max-w-[min(100vw-1rem,72rem)] max-h-[92vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost sticky top-0 float-right z-20 bg-base-100/90">✕</button>
          </form>
          <div className="clear-both w-full min-w-0">

            {/* PDF */}
            {type === "pdf" && (
              <>
                {loading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16">
                    <span className="loading loading-spinner loading-lg text-(--main-arci)" />
                    <p className="text-gray-500 text-sm">Cargando archivo...</p>
                  </div>
                )}
                {!loading && blobUrl && (
                  <iframe
                    src={blobUrl}
                    className="w-full rounded border-0"
                    style={{ height: "75vh" }}
                    title="Vista previa del archivo"
                  />
                )}
                {!loading && fetchError && (
                  <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <IoDocumentAttachOutline size={64} className="text-gray-400" />
                    <p className="text-gray-500">No se pudo cargar la vista previa.</p>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn bg-(--main-arci) text-white">
                      <IoOpenOutline size={18} />
                      Abrir en nueva pestaña
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Imagen */}
            {type === "image" && (
              <img src={url} className="max-w-full mx-auto rounded" alt="Vista previa del archivo" />
            )}

            {/* Otros */}
            {type === "other" && (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                <IoDocumentAttachOutline size={64} className="text-gray-400" />
                <p className="text-gray-500">No se puede previsualizar este tipo de archivo.</p>
                <a href={url} download className="btn bg-(--main-arci) text-white">
                  <IoDownloadOutline size={18} />
                  Descargar archivo
                </a>
              </div>
            )}

          </div>
        </div>
      </dialog>
    </div>
  );
}
