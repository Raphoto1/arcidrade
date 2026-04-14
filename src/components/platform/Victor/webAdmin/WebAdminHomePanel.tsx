"use client";
import { useState } from "react";
import useSWR from "swr";
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import ModalForPreview from "@/components/modals/ModalForPreview";
import WebAdminHomePreview from "@/components/platform/Victor/webAdmin/previews/WebAdminHomePreview";

interface CarouselItem {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  link: string | null;
  order: number | null;
  created_at: string;
}

const staticFallback = [
  {
    title: "Carrusel principal",
    description: "Actualmente el home abre con `Carousel`, usando slides rotativos con imagen de fondo y texto destacado.",
  },
  {
    title: "Acceso rápido y onboarding",
    description: "Debajo del carrusel hay un CTA de login y el bloque `Steps`, que muestra registro, carga de documentos y acceso a ofertas.",
  },
  {
    title: "Ventanas destacadas iniciales",
    description: "`GridHomeWindows` pinta las ventanas rectangulares con accesos desde los datos estáticos de `offers`.",
  },
  {
    title: "Bloque intermedio",
    description: "`ThreeColumnGrid` ya está montado en el home, aunque hoy está vacío y sirve como reserva para contenido futuro.",
  },
  {
    title: "Provincias y especialidades",
    description: "Se usan separadores `BrColors` y luego `GridHomeWindowsCities` y `GridHomeWindowsSpecialities` para destacar navegación temática.",
  },
  {
    title: "Ofertas públicas",
    description: "El home cierra con `OffersPublic`, que hoy muestra el título 'Principales Ofertas Disponibles' y el grid público de procesos.",
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const emptyForm = { title: "", description: "", image: "", link: "", order: "" };

export default function WebAdminHomePanel() {
  const { data, isLoading, mutate } = useSWR<{ success: boolean; payload: CarouselItem[] }>(
    "/api/platform/victor/home-page/carousel",
    fetcher
  );

  const items: CarouselItem[] = data?.success ? (data.payload ?? []) : [];
  const hasDbData = !isLoading && data?.success && items.length > 0;

  // --- create ---
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // --- edit ---
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // --- delete ---
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!form.title.trim()) { setCreateError("El título es requerido"); return; }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/platform/victor/home-page/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) { setCreateError(json.error ?? "Error al crear"); return; }
      setForm(emptyForm);
      mutate();
    } catch {
      setCreateError("Error al crear slide");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: CarouselItem) => {
    setEditId(item.id);
    setEditForm({
      title: item.title,
      description: item.description ?? "",
      image: item.image ?? "",
      link: item.link ?? "",
      order: item.order != null ? String(item.order) : "",
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm(emptyForm); };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || editId === null) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/platform/victor/home-page/carousel/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) { cancelEdit(); mutate(); }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/platform/victor/home-page/carousel/${id}`, { method: "DELETE" });
      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="h-2 w-full bg-linear-to-r from-(--main-arci) to-(--orange-arci)" />

      <div className="p-4">
        {/* cabecera compacta */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-oswald text-xl text-(--main-arci)">Home — Carrusel</h2>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] ${hasDbData ? "bg-green-100 text-green-700" : "text-gray-500 bg-gray-100"}`}>
              {hasDbData ? "Activo" : "Sin datos"}
            </span>
            <ModalForPreview title="Ver preview del home">
              <WebAdminHomePreview />
            </ModalForPreview>
          </div>
        </div>

        {/* lista */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-32">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <span className="loading loading-spinner loading-md text-(--main-arci)" />
            </div>
          ) : hasDbData ? (
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-gray-100 bg-white p-3">
                  {editId === item.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Título *"
                        maxLength={200}
                      />
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Descripción"
                      />
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editForm.image}
                        onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                        placeholder="URL imagen"
                      />
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editForm.link}
                        onChange={(e) => setEditForm((f) => ({ ...f, link: e.target.value }))}
                        placeholder="Enlace"
                      />
                      <input
                        className="input input-bordered input-sm w-24"
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm((f) => ({ ...f, order: e.target.value }))}
                        placeholder="Orden"
                      />
                      <div className="flex gap-2 pt-1">
                        <button
                          className="btn btn-sm btn-success text-white gap-1"
                          onClick={handleSaveEdit}
                          disabled={saving}
                        >
                          {saving ? <span className="loading loading-spinner loading-xs" /> : <FiCheck size={13} />}
                          Guardar
                        </button>
                        <button className="btn btn-sm btn-ghost gap-1" onClick={cancelEdit}>
                          <FiX size={13} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {item.order != null && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-400">
                              #{item.order}
                            </span>
                          )}
                          <p className="font-semibold text-(--main-arci) truncate">{item.title}</p>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        )}
                        {item.link && (
                          <p className="mt-1 text-xs text-blue-500 truncate">{item.link}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          className="btn btn-xs btn-ghost text-gray-400 hover:text-(--main-arci)"
                          onClick={() => startEdit(item)}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          className="btn btn-xs btn-ghost text-gray-400 hover:text-red-500"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id
                            ? <span className="loading loading-spinner loading-xs" />
                            : <FiTrash2 size={13} />}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            /* fallback estático */
            <div>
              <p className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 font-medium">
                Sin datos en DB — mostrando estructura estática de referencia
              </p>
              <ul className="space-y-2">
                {staticFallback.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-3 opacity-70">
                    <p className="font-semibold text-(--main-arci) text-sm">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">{item.description}</p>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* formulario nuevo slide */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Agregar slide</p>
          <div className="flex flex-col gap-2">
            <input
              className="input input-bordered input-sm w-full"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Título *"
              maxLength={200}
            />
            <input
              className="input input-bordered input-sm w-full"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descripción"
            />
            <input
              className="input input-bordered input-sm w-full"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="URL imagen"
            />
            <input
              className="input input-bordered input-sm w-full"
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="Enlace"
            />
            <input
              className="input input-bordered input-sm w-24"
              type="number"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              placeholder="Orden"
            />
            {createError && <p className="text-xs text-red-500">{createError}</p>}
            <button
              className="btn btn-sm text-white gap-1 mt-1 self-start"
              style={{ backgroundColor: "var(--main-arci)" }}
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? <span className="loading loading-spinner loading-xs" /> : <FiPlus size={13} />}
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
