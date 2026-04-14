"use client";
import { useState } from "react";
import useSWR from "swr";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiTag } from "react-icons/fi";

interface SubArea {
  id: number;
  sub_area: string;
  description: string | null;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WebAdminGeneralSubAreasPanel() {
  const { data, isLoading, mutate } = useSWR<{ success: boolean; payload: SubArea[] }>(
    "/api/platform/victor/general-subareas",
    fetcher
  );

  const subAreas: SubArea[] = data?.payload ?? [];

  // --- estado formulario nuevo ---
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // --- estado edición inline ---
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // --- estado eliminación ---
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreateError("El nombre es requerido");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/platform/victor/general-subareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub_area: newName, description: newDesc }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error ?? "Error al crear");
        return;
      }
      setNewName("");
      setNewDesc("");
      mutate();
    } catch {
      setCreateError("Error al crear sub-área");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: SubArea) => {
    setEditId(item.id);
    setEditName(item.sub_area);
    setEditDesc(item.description ?? "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || editId === null) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/platform/victor/general-subareas/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub_area: editName, description: editDesc }),
      });
      if (res.ok) {
        cancelEdit();
        mutate();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/platform/victor/general-subareas/${id}`, { method: "DELETE" });
      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* acento color */}
      <div className="h-2 w-full bg-linear-to-r from-violet-500 to-purple-400" />

      <div className="p-4">
        {/* cabecera compacta */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-oswald text-xl text-(--main-arci)">Sub-Áreas General</h2>
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-green-700">
            Activo
          </span>
        </div>

        {/* lista */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-30">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <span className="loading loading-spinner loading-md text-(--main-arci)" />
            </div>
          ) : subAreas.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">
              Aún no hay sub-áreas registradas. Agrega la primera abajo.
            </p>
          ) : (
            <ul className="space-y-2">
              {subAreas.map((item) => (
                <li key={item.id} className="rounded-2xl border border-gray-100 bg-white p-3">
                  {editId === item.id ? (
                    /* --- modo edición --- */
                    <div className="flex flex-col gap-2">
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nombre"
                        maxLength={100}
                      />
                      <input
                        className="input input-bordered input-sm w-full"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Descripción (opcional)"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          className="btn btn-xs bg-(--main-arci) text-white hover:bg-(--soft-arci)"
                        >
                          {saving ? <span className="loading loading-spinner loading-xs" /> : <FiCheck size={12} />}
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-xs bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          <FiX size={12} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* --- modo vista --- */
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <FiTag className="mt-0.5 shrink-0 text-(--main-arci)" size={14} />
                        <div>
                          <p className="text-sm font-semibold text-(--main-arci)">{item.sub_area}</p>
                          {item.description && (
                            <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="btn btn-ghost btn-xs text-gray-500 hover:text-blue-600"
                          title="Editar"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="btn btn-ghost btn-xs text-gray-500 hover:text-red-600"
                          title="Eliminar"
                        >
                          {deletingId === item.id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <FiTrash2 size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* formulario agregar */}
        <div className="mt-4 rounded-2xl border border-dashed border-violet-200 bg-violet-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-violet-500">
            Agregar nueva sub-área
          </p>
          <div className="flex flex-col gap-2">
            <input
              className="input input-bordered input-sm w-full bg-white"
              placeholder="Nombre de la sub-área *"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
              maxLength={100}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            />
            <input
              className="input input-bordered input-sm w-full bg-white"
              placeholder="Descripción (opcional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            />
            {createError && (
              <p className="text-xs text-red-500">{createError}</p>
            )}
            <button
              onClick={handleCreate}
              disabled={creating}
              className="btn btn-sm bg-(--main-arci) text-white hover:bg-(--soft-arci) self-end"
            >
              {creating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FiPlus size={14} />
              )}
              Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
