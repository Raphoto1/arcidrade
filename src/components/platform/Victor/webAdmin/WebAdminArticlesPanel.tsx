"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { FiCheck, FiCheckCircle, FiChevronDown, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import DescriptionRichTextWrapper from "@/components/forms/DescriptionRichTextWrapper";
import RichTextPreview from "@/components/ui/RichTextPreview";
import { ArticleItem, ArticlesListResponse, SectionVisibilityResponse } from "@/types/articles";

const fetcher = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo cargar la API");
  }
  return response.json();
};

const emptyForm = {
  title: "",
  slug: "",
  shortText: "",
  image: "",
  publishedAt: "",
  contentHtml: "",
  isActive: true,
};

type ArticleFormState = typeof emptyForm;

function createSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validateArticleForm(form: ArticleFormState, currentId: number | null, items: ArticleItem[]) {
  if (!form.title.trim()) return "El titulo es obligatorio";
  if (form.title.trim().length > 180) return "El titulo no puede superar 180 caracteres";

  const normalizedSlug = createSlug(form.slug || form.title);
  if (!normalizedSlug) return "El slug es obligatorio";
  const duplicateSlug = items.some((item) => item.slug === normalizedSlug && item.id !== currentId);
  if (duplicateSlug) return "Ya existe un articulo con ese slug";

  if (!form.shortText.trim()) return "El texto corto es obligatorio";
  if (form.shortText.trim().length > 320) return "El texto corto no puede superar 320 caracteres";

  if (form.image.trim()) {
    try {
      const imageUrl = new URL(form.image.trim());
      if (!imageUrl.protocol.startsWith("http")) {
        return "La URL de imagen debe usar http o https";
      }
    } catch {
      return "La URL de imagen no es valida";
    }
  }

  if (!form.publishedAt) return "La fecha de publicacion es obligatoria";
  if (!form.contentHtml.trim()) return "El contenido enriquecido es obligatorio";

  return "";
}

export default function WebAdminArticlesPanel() {
  const { data, isLoading, mutate } = useSWR<ArticlesListResponse>(
    "/api/platform/victor/articles",
    fetcher
  );
  const {
    data: sectionData,
    isLoading: sectionLoading,
    mutate: mutateSection,
  } = useSWR<SectionVisibilityResponse>(
    "/api/platform/victor/articles/section",
    fetcher
  );

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [form, setForm] = useState<ArticleFormState>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingSection, setIsTogglingSection] = useState(false);
  const [togglingArticleId, setTogglingArticleId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (data?.success) {
      setArticles(data.payload);
    }
  }, [data]);

  useEffect(() => {
    if (sectionData?.success) {
      setIsSectionActive(sectionData.payload.isActive);
    }
  }, [sectionData]);

  const orderedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [articles]);
  const hasArticles = orderedArticles.length > 0;

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setFormError("");
  };

  const setFeedback = (message: string, type: "success" | "error") => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const applySave = async () => {
    const validationError = validateArticleForm(form, editId, articles);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const normalizedSlug = createSlug(form.slug || form.title);
    const payload = {
      title: form.title.trim(),
      slug: normalizedSlug,
      shortText: form.shortText.trim(),
      image: form.image.trim(),
      publishedAt: form.publishedAt,
      contentHtml: form.contentHtml,
      isActive: form.isActive,
    };

    setIsSaving(true);
    setFormError("");

    try {
      const endpoint = editId ? `/api/platform/victor/articles/${editId}` : "/api/platform/victor/articles";
      const method = editId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setFormError(result?.error || "No se pudo guardar el articulo");
        return;
      }

      await mutate();
      setFeedback(editId ? "Articulo actualizado" : "Articulo creado", "success");
      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error al guardar articulo:", error);
      setFormError("Error inesperado al guardar el articulo");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (article: ArticleItem) => {
    setEditId(article.id);
    setIsFormOpen(true);
    setForm({
      title: article.title,
      slug: article.slug,
      shortText: article.shortText,
      image: article.image,
      publishedAt: article.publishedAt,
      contentHtml: article.contentHtml,
      isActive: article.isActive,
    });
    setFormError("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Esta accion eliminara el articulo. ¿Deseas continuar?")) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/platform/victor/articles/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result?.error || "No se pudo eliminar el articulo", "error");
        return;
      }

      setArticles((prev) => prev.filter((item) => item.id !== id));
      void mutate();
      setFeedback("Articulo eliminado", "success");
      if (editId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error al eliminar articulo:", error);
      setFeedback("Error inesperado al eliminar", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrepareCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleToggleArticle = async (id: number, isActive: boolean) => {
    setTogglingArticleId(id);
    setIsSaving(true);
    try {
      const response = await fetch(`/api/platform/victor/articles/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result?.error || "No se pudo cambiar el estado del articulo", "error");
        return;
      }

      await mutate();
      setFeedback(isActive ? "Articulo activado" : "Articulo desactivado", "success");
    } catch (error) {
      console.error("Error al cambiar estado del articulo:", error);
      setFeedback("Error inesperado al cambiar el estado", "error");
    } finally {
      setIsSaving(false);
      setTogglingArticleId(null);
    }
  };

  const handleToggleSection = async (nextValue: boolean) => {
    if (nextValue && !hasArticles) {
      setFeedback("Primero debes crear al menos un articulo para activar la seccion", "error");
      return;
    }

    setIsTogglingSection(true);
    setIsSaving(true);
    try {
      const response = await fetch("/api/platform/victor/articles/section", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextValue }),
      });
      const result = await response.json();

      if (!response.ok) {
        setFeedback(result?.error || "No se pudo actualizar la seccion", "error");
        return;
      }

      setIsSectionActive(nextValue);
      await mutateSection();
      setFeedback(nextValue ? "Seccion de articulos activada" : "Seccion de articulos desactivada", "success");
    } catch (error) {
      console.error("Error al actualizar seccion de articulos:", error);
      setFeedback("Error inesperado al actualizar la seccion", "error");
    } finally {
      setIsSaving(false);
      setIsTogglingSection(false);
    }
  };

  return (
    <article className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
      <div className='h-2 w-full bg-linear-to-r from-violet-500 to-fuchsia-500' />
      <div className='space-y-4 p-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h2 className='font-oswald text-xl text-(--main-arci)'>Articulos - Editor</h2>
            <p className='text-xs text-gray-500'>Gestion de articulos con persistencia en base de datos y control de visibilidad publica.</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${isSectionActive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
            {isSectionActive ? "Seccion activa" : "Seccion inactiva"}
          </span>
        </div>

        <section className='w-full rounded-2xl border border-gray-200 bg-white p-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <h3 className='font-semibold text-(--main-arci)'>Visibilidad de seccion</h3>
              <p className='text-xs text-gray-500'>Si desactivas la seccion, se oculta de la barra de navegacion y la pagina publica responde 404.</p>
            </div>
            <button
              type='button'
              className={`btn btn-sm ${isSectionActive ? "btn-error" : "btn-success"}`}
              onClick={() => handleToggleSection(!isSectionActive)}
              disabled={isSaving || sectionLoading || (!isSectionActive && !hasArticles)}
            >
              {isTogglingSection && <span className='loading loading-spinner loading-xs' />}
              {isTogglingSection ? "Procesando..." : isSectionActive ? "Desactivar seccion" : "Activar seccion"}
            </button>
          </div>
          {!isSectionActive && !hasArticles && (
            <p className='mt-2 text-xs text-amber-700'>
              Crea al menos un articulo para habilitar la activacion de la seccion.
            </p>
          )}
        </section>

        <section className='w-full rounded-2xl border border-gray-200 bg-gray-50 p-3'>
          <button
            type='button'
            className='flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left'
            onClick={() => setIsFormOpen((prev) => !prev)}
          >
            <div>
              <h3 className='font-semibold text-(--main-arci)'>{editId ? "Editar articulo" : "Crear articulo"}</h3>
              <p className='text-xs text-gray-500'>Completa los campos y guarda para actualizar la base de datos.</p>
            </div>
            <FiChevronDown className={`text-gray-500 transition-transform ${isFormOpen ? "rotate-180" : "rotate-0"}`} />
          </button>

          {isFormOpen && (
            <div className='mt-4 space-y-5'>
              <div className='flex items-center justify-end'>
                {editId && (
                  <button type='button' className='btn btn-xs btn-ghost gap-1' onClick={resetForm}>
                    <FiX size={12} /> cancelar edicion
                  </button>
                )}
              </div>

              <div className='grid gap-5 lg:grid-cols-12'>
                <div className='space-y-4 rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-7'>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-gray-400'>Datos principales</p>
                  <label className='form-control gap-1.5'>
                    <span className='label-text text-xs text-gray-500'>Titulo *</span>
                    <input
                      className='input input-bordered w-full'
                      value={form.title}
                      onChange={(e) => {
                        const nextTitle = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title: nextTitle,
                          slug: editId ? prev.slug : createSlug(nextTitle),
                        }));
                      }}
                      placeholder='Ej: Alianzas hospitalarias 2026'
                      maxLength={180}
                    />
                  </label>

                  <label className='form-control gap-1.5'>
                    <span className='label-text text-xs text-gray-500'>Texto corto *</span>
                    <textarea
                      className='textarea textarea-bordered min-h-28 w-full'
                      value={form.shortText}
                      onChange={(e) => setForm((prev) => ({ ...prev, shortText: e.target.value }))}
                      maxLength={320}
                      placeholder='Resumen breve para tarjetas y meta description.'
                    />
                  </label>

                  <label className='form-control gap-1.5'>
                    <span className='label-text text-xs text-gray-500'>URL de imagen (opcional)</span>
                    <input
                      className='input input-bordered w-full'
                      value={form.image}
                      onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder='https://images.pexels.com/... (si lo dejas vacio se usa imagen por defecto)'
                    />
                  </label>
                </div>

                <div className='space-y-4 rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-5'>
                  <p className='text-xs font-semibold uppercase tracking-[0.14em] text-gray-400'>Publicacion</p>
                  <label className='form-control gap-1.5'>
                    <span className='label-text text-xs text-gray-500'>Slug *</span>
                    <input
                      className='input input-bordered w-full'
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: createSlug(e.target.value) }))}
                      placeholder='alianzas-hospitalarias-2026'
                    />
                  </label>
                  <label className='form-control gap-1.5'>
                    <span className='label-text text-xs text-gray-500'>Fecha de publicacion *</span>
                    <input
                      type='date'
                      className='input input-bordered w-full'
                      value={form.publishedAt}
                      onChange={(e) => setForm((prev) => ({ ...prev, publishedAt: e.target.value }))}
                    />
                  </label>
                  <div className='rounded-xl border border-gray-200 p-2'>
                    <p className='mb-2 text-xs text-gray-500'>Estado del articulo</p>
                    <button
                      type='button'
                      className={`btn btn-sm w-full ${form.isActive ? "btn-success" : "btn-outline"}`}
                      onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    >
                      {form.isActive ? <FiCheckCircle size={14} /> : <FiX size={14} />}
                      {form.isActive ? "Activo en publico" : "Inactivo en publico"}
                    </button>
                  </div>
                </div>
              </div>

              <div className='rounded-2xl border border-gray-200 bg-white p-4'>
                <DescriptionRichTextWrapper
                  value={form.contentHtml}
                  onChange={(value) => setForm((prev) => ({ ...prev, contentHtml: value }))}
                  label='Contenido enriquecido *'
                  placeholder='Escribe aqui el cuerpo completo del articulo...'
                  minHeight='260px'
                  required
                />
              </div>

              {formError && <p className='text-xs text-red-500'>{formError}</p>}

              <div className='flex flex-wrap items-center gap-3 pt-1'>
                <button
                  type='button'
                  className='btn btn-sm text-white gap-1 bg-(--main-arci) hover:bg-(--soft-arci)'
                  onClick={applySave}
                  disabled={isSaving}
                >
                  {editId ? <FiCheck size={13} /> : <FiPlus size={13} />}
                  {isSaving ? "Guardando..." : editId ? "Guardar cambios" : "Crear articulo"}
                </button>
                <button type='button' className='btn btn-sm btn-ghost' onClick={resetForm}>Limpiar</button>
              </div>
            </div>
          )}
        </section>

        {statusMessage && (
          <p className={`text-xs ${statusType === "error" ? "text-red-500" : "text-emerald-600"}`}>
            {statusMessage}
          </p>
        )}

        <section className='w-full rounded-2xl border border-gray-200 bg-white p-3'>
          <div className='mb-3 flex items-center justify-between gap-2'>
            <h3 className='font-semibold text-(--main-arci)'>Listado ({orderedArticles.length})</h3>
            <div className='flex items-center gap-2'>
              {isLoading && <span className='loading loading-spinner loading-xs text-(--main-arci)' />}
              <button type='button' className='btn btn-xs btn-outline gap-1' onClick={handlePrepareCreate}>
                <FiPlus size={12} /> Nuevo articulo
              </button>
            </div>
          </div>

          <ul className='space-y-2 max-h-170 overflow-y-auto pr-1'>
            {orderedArticles.map((item) => (
              <li key={item.id} className='rounded-2xl border border-gray-100 bg-gray-50 p-3'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <p className='font-semibold text-(--main-arci) truncate'>{item.title}</p>
                    {item.isActive && (
                      <span className='mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700'>
                        <FiCheck size={10} /> activo
                      </span>
                    )}
                    <p className='text-[11px] text-gray-400 truncate'>/{item.slug}</p>
                    <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{item.shortText}</p>
                    <p className='mt-1 text-[11px] text-gray-400'>
                      {new Date(item.publishedAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className='flex flex-col gap-1 shrink-0'>
                    <button
                      type='button'
                      className={`btn btn-xs ${item.isActive ? "btn-error" : "btn-success"}`}
                      onClick={() => handleToggleArticle(item.id, !item.isActive)}
                      disabled={isSaving}
                    >
                      {togglingArticleId === item.id && <span className='loading loading-spinner loading-xs' />}
                      {togglingArticleId === item.id ? "Procesando..." : item.isActive ? "Desactivar" : "Activar"}
                    </button>
                    <button type='button' className='btn btn-xs btn-ghost text-gray-500 hover:text-(--main-arci)' onClick={() => startEdit(item)}>
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      type='button'
                      className='btn btn-xs btn-ghost text-gray-500 hover:text-red-500'
                      onClick={() => handleDelete(item.id)}
                      disabled={isSaving}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className='mt-2 rounded-xl border border-gray-100 bg-white p-2'>
                  <RichTextPreview content={item.contentHtml} maxHeight='72px' className='text-xs text-gray-600' />
                </div>
              </li>
            ))}
            {!orderedArticles.length && !isLoading && (
              <li className='rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500'>
                No hay articulos cargados. Crea el primero para poder activar la seccion.
              </li>
            )}
          </ul>
        </section>
      </div>
    </article>
  );
}
