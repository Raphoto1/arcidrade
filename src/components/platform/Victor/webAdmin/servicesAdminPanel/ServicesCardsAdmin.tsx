"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { FiCheck, FiChevronDown, FiEdit2, FiInfo, FiTrash2, FiX } from "react-icons/fi";
import { servicesItems as staticServicesItems } from "@/static/data/staticData";

type ServicesItem = {
  id: number;
  title: string;
  extraText: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  order: number | null;
  contact: boolean;
  created_at: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const emptyForm = { title: "", extraText: "", description: "", image: "", link: "", order: "", contact: false };
type ServicesFormState = typeof emptyForm;
const MAX_SERVICES_CARDS = 9;

function validateServicesForm(value: ServicesFormState) {
  if (!value.title.trim()) return "El titulo es requerido";
  if (value.title.trim().length > 200) return "El titulo no puede superar 200 caracteres";

  if (!value.extraText.trim()) return "El texto sobre imagen es requerido";
  if (value.extraText.trim().length > 280) return "El texto sobre imagen no puede superar 280 caracteres";

  if (!value.description.trim()) return "La descripcion es requerida";
  if (value.description.trim().length > 1000) return "La descripcion no puede superar 1000 caracteres";

  if (!value.image.trim()) return "La URL de imagen es requerida";
  try {
    const imageUrl = new URL(value.image.trim());
    if (!["http:", "https:"].includes(imageUrl.protocol)) {
      return "La URL de imagen debe iniciar con http:// o https://";
    }
  } catch {
    return "La URL de imagen no es valida";
  }

  if (value.link.trim()) {
    const linkValue = value.link.trim();
    if (!linkValue.startsWith("/")) {
      try {
        const url = new URL(linkValue);
        if (!["http:", "https:"].includes(url.protocol)) {
          return "El enlace debe ser ruta interna (/services) o URL http(s)";
        }
      } catch {
        return "El enlace no es valido";
      }
    }
  }

  if (value.order.trim()) {
    const parsed = Number(value.order);
    if (!Number.isInteger(parsed)) return "El orden debe ser un numero entero";
  }

  return "";
}

function ServicesForm({
  sectionTitle,
  value,
  submitLabel,
  submitting,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  sectionTitle?: string;
  value: ServicesFormState;
  submitLabel: string;
  submitting: boolean;
  error: string;
  onChange: (next: ServicesFormState) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className='flex flex-col gap-3'>
      {sectionTitle && <p className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>{sectionTitle}</p>}

      <label className='form-control'>
        <span className='label-text text-xs text-gray-500'>Titulo *</span>
        <input
          className='input input-bordered input-sm w-full'
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder='Ej: Captacion de Talento Medico'
          maxLength={200}
        />
      </label>

      <label className='form-control'>
        <span className='label-text text-xs text-gray-500'>Texto sobre imagen *</span>
        <textarea
          className='textarea textarea-bordered textarea-sm w-full min-h-20'
          value={value.extraText}
          onChange={(e) => onChange({ ...value, extraText: e.target.value })}
          placeholder='Texto breve que se muestra sobre la imagen principal'
          maxLength={280}
        />
      </label>

      <label className='form-control'>
        <span className='label-text text-xs text-gray-500'>Descripcion extensa *</span>
        <textarea
          className='textarea textarea-bordered textarea-sm w-full min-h-28'
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder='Texto principal que se mostrara en la seccion de services'
          maxLength={1000}
        />
      </label>

      <div className='grid gap-2 md:grid-cols-2'>
        <label className='form-control'>
          <span className='label-text text-xs text-gray-500'>URL de imagen *</span>
          <input
            className='input input-bordered input-sm w-full'
            value={value.image}
            onChange={(e) => onChange({ ...value, image: e.target.value })}
            placeholder='https://...'
          />
        </label>
        <label className='form-control'>
          <span className='label-text text-xs text-gray-500'>Orden</span>
          <input
            className='input input-bordered input-sm w-full'
            type='number'
            value={value.order}
            onChange={(e) => onChange({ ...value, order: e.target.value })}
            placeholder='1'
          />
        </label>
      </div>

      <label className='form-control'>
        <span className='label-text flex items-center gap-1 text-xs text-gray-500'>
          Enlace
          <span
            className='tooltip tooltip-right'
            data-tip='Acepta rutas internas como /services y tambien URLs completas con http(s). Si lo dejas vacio, no se muestra boton de enlace.'>
            <span className='inline-flex cursor-help text-gray-400 hover:text-(--main-arci)'>
              <FiInfo size={13} />
            </span>
          </span>
        </span>
        <input
          className='input input-bordered input-sm w-full'
          value={value.link}
          onChange={(e) => onChange({ ...value, link: e.target.value })}
          placeholder='/services (opcional)'
        />
      </label>

      <label className='form-control'>
        <div className='label cursor-pointer justify-start gap-3'>
          <input
            type='checkbox'
            className='h-4 w-4 shrink-0 cursor-pointer appearance-auto rounded border border-gray-400 bg-white'
            style={{ accentColor: "var(--main-arci)" }}
            checked={value.contact}
            onChange={(e) => onChange({ ...value, contact: e.target.checked })}
          />
          <span className='label-text text-xs font-medium text-gray-600'>Mostrar opcion de contacto</span>
        </div>
      </label>

      {value.image.trim() && !validateServicesForm({ ...value, title: "ok", extraText: "ok", description: "ok", order: "", link: "" }) && (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
          <div className='relative h-32 w-full'>
            <img src={value.image} alt='Preview de imagen' className='h-full w-full object-cover' loading='lazy' />
            <div className='absolute inset-0 bg-black/30' />
            <p className='absolute bottom-2 left-2 right-2 text-sm font-semibold text-white drop-shadow-lg'>
              {value.extraText.trim() || "Texto sobre imagen"}
            </p>
          </div>
        </div>
      )}

      {error && <p className='text-xs text-red-500'>{error}</p>}

      <div className='flex items-center gap-2 pt-1'>
        <button className='btn btn-sm text-white gap-1' style={{ backgroundColor: "var(--main-arci)" }} onClick={onSubmit} disabled={submitting}>
          {submitting ? <span className='loading loading-spinner loading-xs' /> : <FiCheck size={13} />}
          {submitLabel}
        </button>
        {onCancel && (
          <button className='btn btn-sm btn-ghost gap-1' onClick={onCancel}>
            <FiX size={13} /> Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

function ServicesList({
  isLoading,
  hasDbData,
  items,
  draggingId,
  deletingId,
  onStartEdit,
  onDelete,
  onDragStart,
  onDropItem,
  onDragEnd,
}: {
  isLoading: boolean;
  hasDbData: boolean;
  items: ServicesItem[];
  draggingId: number | null;
  deletingId: number | null;
  onStartEdit: (item: ServicesItem) => void;
  onDelete: (id: number) => void;
  onDragStart: (id: number) => void;
  onDropItem: (targetId: number) => void;
  onDragEnd: () => void;
}) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-20'>
        <span className='loading loading-spinner loading-md text-(--main-arci)' />
      </div>
    );
  }

  if (!hasDbData) {
    return (
      <div>
        <p className='mb-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 font-medium'>
          Sin datos en DB - mostrando estructura estatica de referencia
        </p>
        <ul className='space-y-2'>
          {staticServicesItems.map((item: any) => (
            <div key={item.title} className='rounded-2xl border border-gray-100 bg-white p-3 opacity-70'>
              <p className='font-semibold text-(--main-arci) text-sm'>{item.title}</p>
              <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{item.extraText}</p>
              <p className='mt-1 text-xs leading-5 text-gray-500 line-clamp-2'>{item.longText ?? item.description}</p>
            </div>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className='space-y-2'>
      {items.map((item) => (
        <li
          key={item.id}
          className={`rounded-2xl border bg-white p-3 transition ${draggingId === item.id ? "border-(--main-arci) opacity-70" : "border-gray-100"}`}
          draggable
          onDragStart={() => onDragStart(item.id)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDropItem(item.id)}
        >
          <div className='flex items-start justify-between gap-2'>
            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-gray-400'>.....</span>
                {item.order != null && <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-400'>#{item.order}</span>}
                <p className='font-semibold text-(--main-arci) truncate'>{item.title}</p>
              </div>
              <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{item.extraText}</p>
              <p className='mt-1 text-xs text-gray-500 line-clamp-2'>{item.description}</p>
              {item.image && <p className='mt-1 text-xs text-gray-500 truncate'>{item.image}</p>}
            </div>
            <div className='flex shrink-0 gap-1'>
              <button className='btn btn-xs btn-ghost text-gray-400 hover:text-(--main-arci)' onClick={() => onStartEdit(item)}>
                <FiEdit2 size={13} />
              </button>
              <button className='btn btn-xs btn-ghost text-gray-400 hover:text-red-500' onClick={() => onDelete(item.id)} disabled={deletingId === item.id}>
                {deletingId === item.id ? <span className='loading loading-spinner loading-xs' /> : <FiTrash2 size={13} />}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesCardsAdmin() {
  const { data, isLoading, mutate } = useSWR<{ success: boolean; payload: ServicesItem[] }>("/api/platform/victor/services-page", fetcher);

  const items: ServicesItem[] = useMemo(() => {
    return data?.success ? (data.payload ?? []) : [];
  }, [data?.success, data?.payload]);
  const hasDbData = Boolean(!isLoading && data?.success && items.length > 0);
  const canCreateMore = items.length < MAX_SERVICES_CARDS;

  const [orderedItems, setOrderedItems] = useState<ServicesItem[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const sorted = [...items].sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    setOrderedItems(sorted);
  }, [items]);

  const handleCreate = async () => {
    if (!canCreateMore) {
      setCreateError(`Solo puedes tener ${MAX_SERVICES_CARDS} cards de Services.`);
      return;
    }

    const validationError = validateServicesForm(form);
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/platform/victor/services-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error ?? "Error al crear card");
        return;
      }
      setForm(emptyForm);
      mutate();
    } catch {
      setCreateError("Error al crear card");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: ServicesItem) => {
    setEditId(item.id);
    setEditError("");
    setCreateError("");
    setEditForm({
      title: item.title,
      extraText: item.extraText ?? "",
      description: item.description ?? "",
      image: item.image ?? "",
      link: item.link ?? "",
      order: item.order != null ? String(item.order) : "",
      contact: item.contact ?? false,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditError("");
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async () => {
    const validationError = validateServicesForm(editForm);
    if (validationError || editId === null) {
      setEditError(validationError || "No se pudo identificar la card");
      return;
    }

    setSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/platform/victor/services-page/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) {
        setEditError(json.error ?? "Error al guardar cambios");
        return;
      }
      cancelEdit();
      mutate();
    } catch {
      setEditError("Error de red al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`/api/platform/victor/services-page/${id}`, { method: "DELETE" });
      mutate();
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragStart = (id: number) => {
    setDraggingId(id);
    setOrderError("");
    setOrderMessage("");
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDropItem = async (targetId: number) => {
    if (draggingId === null || draggingId === targetId || ordering) return;

    const fromIndex = orderedItems.findIndex((item) => item.id === draggingId);
    const toIndex = orderedItems.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggingId(null);
      return;
    }

    const nextItems = [...orderedItems];
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);

    const withRecalculatedOrder = nextItems.map((item, index) => ({ ...item, order: index + 1 }));
    setOrderedItems(withRecalculatedOrder);
    setDraggingId(null);
    setOrdering(true);
    setOrderError("");

    try {
      const responses = await Promise.all(
        withRecalculatedOrder.map((item) =>
          fetch(`/api/platform/victor/services-page/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: item.title,
              extraText: item.extraText ?? "",
              description: item.description ?? "",
              image: item.image ?? "",
              link: item.link ?? "",
              order: item.order,
            }),
          })
        )
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("No se pudo guardar el nuevo orden");
      }

      setOrderMessage("Orden actualizado correctamente");
      mutate();
    } catch {
      setOrderError("Error al guardar el orden. Intenta de nuevo.");
      mutate();
    } finally {
      setOrdering(false);
    }
  };

  return (
    <details className='group mt-4 rounded-2xl border border-gray-200 bg-gray-50' open>
      <summary className='list-none cursor-pointer p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className='font-semibold text-(--main-arci)'>Cards principales de Services</h3>
            <p className='mt-1 text-xs text-gray-500'>Administra los bloques de contenido de la pagina Services.</p>
          </div>
          <div className='flex items-center gap-2 shrink-0'>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] ${hasDbData ? "bg-green-100 text-green-700" : "text-gray-500 bg-gray-100"}`}>
              {hasDbData ? "Activo" : "Sin datos"}
            </span>
            <FiChevronDown className='text-gray-400 transition-transform duration-200 group-open:rotate-180' size={18} />
          </div>
        </div>
      </summary>

      <div className='px-4 pb-4'>
        <div className='rounded-2xl border border-gray-200 bg-white p-4'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>Orden de cards</p>
          <p className='mb-3 text-xs text-gray-500'>Arrastra y suelta para cambiar el orden de visualizacion.</p>
          {ordering && <p className='mb-3 text-xs text-(--main-arci)'>Guardando nuevo orden...</p>}
          {orderError && <p className='mb-3 text-xs text-red-500'>{orderError}</p>}
          {orderMessage && <p className='mb-3 text-xs text-green-600'>{orderMessage}</p>}

          <ServicesList
            isLoading={isLoading}
            hasDbData={hasDbData}
            items={orderedItems}
            draggingId={draggingId}
            deletingId={deletingId}
            onStartEdit={startEdit}
            onDelete={handleDelete}
            onDragStart={handleDragStart}
            onDropItem={handleDropItem}
            onDragEnd={handleDragEnd}
          />
        </div>

        <div className='mt-4 rounded-2xl border border-gray-200 bg-white p-4'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>Formulario de card</p>
          {editId !== null && (
            <p className='mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700'>
              Editando card #{editId}. Guarda cambios o cancela para crear una nueva.
            </p>
          )}
          {editId === null && !canCreateMore && (
            <p className='mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700'>
              Limite alcanzado: maximo {MAX_SERVICES_CARDS} cards de Services. Elimina una para volver a crear.
            </p>
          )}

          {editId === null && canCreateMore ? (
            <ServicesForm
              sectionTitle='Crear card'
              value={form}
              onChange={setForm}
              onSubmit={handleCreate}
              submitting={creating}
              submitLabel='Agregar card'
              error={createError}
            />
          ) : editId !== null ? (
            <ServicesForm
              sectionTitle='Editar card'
              value={editForm}
              onChange={setEditForm}
              onSubmit={handleSaveEdit}
              onCancel={cancelEdit}
              submitting={saving}
              submitLabel='Guardar cambios'
              error={editError}
            />
          ) : null}
        </div>
      </div>
    </details>
  );
}
