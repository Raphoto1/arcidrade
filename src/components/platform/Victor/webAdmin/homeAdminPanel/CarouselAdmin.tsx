"use client";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { FiCheck, FiChevronDown, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

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
    title: "Especialistas disponibles en todo el pais",
    description: "Slide 1 de referencia",
  },
  {
    title: "Instituciones conectadas con talento sanitario",
    description: "Slide 2 de referencia",
  },
  {
    title: "Oportunidades abiertas para profesionales",
    description: "Slide 3 de referencia",
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const emptyForm = { title: "", image: "", order: "" };
type CarouselFormState = typeof emptyForm;

function validateCarouselForm(value: CarouselFormState) {
  if (!value.title.trim()) return "El titulo es requerido";
  if (value.title.trim().length > 200) return "El titulo no puede superar 200 caracteres";

  if (value.image.trim()) {
    try {
      const url = new URL(value.image.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        return "La URL de imagen debe iniciar con http:// o https://";
      }
    } catch {
      return "La URL de imagen no es valida";
    }
  }

  if (value.order.trim()) {
    const parsed = Number(value.order);
    if (!Number.isInteger(parsed)) return "El orden debe ser un numero entero";
  }

  return "";
}

interface CarouselSlideFormProps {
  sectionTitle?: string;
  value: CarouselFormState;
  submitLabel: string;
  submitting: boolean;
  error: string;
  onChange: (next: CarouselFormState) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

function CarouselSlideForm({ sectionTitle, value, submitLabel, submitting, error, onChange, onSubmit, onCancel }: CarouselSlideFormProps) {
  return (
    <div className='flex flex-col gap-3'>
      {sectionTitle && <p className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>{sectionTitle}</p>}
      <div className='grid gap-2 md:grid-cols-2'>
        <label className='form-control'>
          <span className='label-text text-xs text-gray-500'>Texto principal *</span>
          <input
            className='input input-bordered input-sm w-full'
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder='Ej: Especialistas disponibles en todo el pais'
            maxLength={200}
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
        <span className='label-text text-xs text-gray-500'>URL de imagen</span>
        <input
          className='input input-bordered input-sm w-full'
          value={value.image}
          onChange={(e) => onChange({ ...value, image: e.target.value })}
          placeholder='https://...'
        />
      </label>

      {value.image.trim() && !validateCarouselForm({ ...value, order: "", title: "ok" }) && (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white'>
          <div className='relative h-40 w-full'>
            <img src={value.image} alt='Preview de imagen' className='h-full w-full object-cover' loading='lazy' />
            <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent' />
            <p className='absolute bottom-3 left-3 right-3 font-oswald text-sm text-white drop-shadow-lg md:text-base'>
              {value.title.trim() || "Texto principal del slide"}
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

interface CarouselSlidesListProps {
  isLoading: boolean;
  hasDbData: boolean;
  items: CarouselItem[];
  draggingId: number | null;
  deletingId: number | null;
  staticFallbackItems: typeof staticFallback;
  onStartEdit: (item: CarouselItem) => void;
  onDelete: (id: number) => void;
  onDragStart: (id: number) => void;
  onDropItem: (targetId: number) => void;
  onDragEnd: () => void;
}

function CarouselSlidesList({
  isLoading,
  hasDbData,
  items,
  draggingId,
  deletingId,
  staticFallbackItems,
  onStartEdit,
  onDelete,
  onDragStart,
  onDropItem,
  onDragEnd,
}: CarouselSlidesListProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-20'>
        <span className='loading loading-spinner loading-md text-(--main-arci)' />
      </div>
    );
  }

  if (hasDbData) {
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
                  <span className='text-xs text-gray-400'>⋮⋮</span>
                  {item.order != null && <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-400'>#{item.order}</span>}
                  <p className='font-semibold text-(--main-arci) truncate'>{item.title}</p>
                </div>
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

  return (
    <div>
      <p className='mb-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 font-medium'>
        Sin datos en DB — mostrando estructura estatica de referencia
      </p>
      <ul className='space-y-2'>
        {staticFallbackItems.map((item) => (
          <div key={item.title} className='rounded-2xl border border-gray-100 bg-white p-3 opacity-70'>
            <p className='font-semibold text-(--main-arci) text-sm'>{item.title}</p>
            <p className='mt-1 text-xs leading-5 text-gray-500'>{item.description}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default function CarouselAdmin() {
  const { data, isLoading, mutate } = useSWR<{ success: boolean; payload: CarouselItem[] }>("/api/platform/victor/home-page/carousel", fetcher);

  const items: CarouselItem[] = useMemo(() => {
    return data?.success ? (data.payload ?? []) : [];
  }, [data?.success, data?.payload]);
  const hasDbData = Boolean(!isLoading && data?.success && items.length > 0);
  const [orderedItems, setOrderedItems] = useState<CarouselItem[]>([]);
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
    const validationError = validateCarouselForm(form);
    if (validationError) {
      setCreateError(validationError);
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/platform/victor/home-page/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error ?? "Error al crear");
        return;
      }
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
    setEditError("");
    setCreateError("");
    setEditForm({
      title: item.title,
      image: item.image ?? "",
      order: item.order != null ? String(item.order) : "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditError("");
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async () => {
    const validationError = validateCarouselForm(editForm);
    if (validationError || editId === null) {
      setEditError(validationError || "No se pudo identificar el slide");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/platform/victor/home-page/carousel/${editId}`, {
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
      await fetch(`/api/platform/victor/home-page/carousel/${id}`, { method: "DELETE" });
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

  const handleDragEnd = () => {
    setDraggingId(null);
  };

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
          fetch(`/api/platform/victor/home-page/carousel/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: item.title,
              description: item.description ?? "",
              image: item.image ?? "",
              link: item.link ?? "",
              order: item.order,
            }),
          })
        )
      );

      const failed = responses.some((response) => !response.ok);
      if (failed) {
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
    <>
      <details className='group mt-4 rounded-2xl border border-gray-200 bg-gray-50'>
        <summary className='list-none cursor-pointer p-4'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <h3 className='font-semibold text-(--main-arci)'>Carousel principal</h3>
              <p className='mt-1 text-xs text-gray-500'>Slides del carousel principal del home con imagen de fondo y texto principal.</p>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] ${hasDbData ? "bg-green-100 text-green-700" : "text-gray-500 bg-gray-100"}`}>
                {hasDbData ? "Activo" : "Sin datos"}
              </span>
              <FiChevronDown className='text-gray-400 transition-transform duration-200 group-open:rotate-180' size={18} />
            </div>
          </div>
        </summary>

        <div className='px-4 pb-4'>
          <div className='rounded-2xl border border-gray-200 bg-white p-4'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>Orden de Carousel</p>
            <p className='mb-3 text-xs text-gray-500'>Arrastra y suelta los slides para cambiar el orden del carrusel.</p>
            {ordering && (
              <p className='mb-3 text-xs text-(--main-arci)'>Guardando nuevo orden...</p>
            )}
            {orderError && <p className='mb-3 text-xs text-red-500'>{orderError}</p>}
            {orderMessage && <p className='mb-3 text-xs text-green-600'>{orderMessage}</p>}
            <CarouselSlidesList
              isLoading={isLoading}
              hasDbData={hasDbData}
              items={orderedItems}
              draggingId={draggingId}
              deletingId={deletingId}
              staticFallbackItems={staticFallback}
              onStartEdit={startEdit}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDropItem={handleDropItem}
              onDragEnd={handleDragEnd}
            />
          </div>

          <div className='mt-4 rounded-2xl border border-gray-200 bg-white p-4'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400'>Formulario de slide</p>
            {editId !== null && (
              <p className='mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700'>
                Editando slide #{editId}. Guarda cambios o cancela para volver a crear uno nuevo.
              </p>
            )}
            {editId === null ? (
              <CarouselSlideForm
                sectionTitle='Crear slide'
                value={form}
                onChange={setForm}
                onSubmit={handleCreate}
                submitting={creating}
                submitLabel='Agregar slide'
                error={createError}
              />
            ) : (
              <CarouselSlideForm
                sectionTitle='Editar slide'
                value={editForm}
                onChange={setEditForm}
                onSubmit={handleSaveEdit}
                onCancel={cancelEdit}
                submitting={saving}
                submitLabel='Guardar cambios'
                error={editError}
              />
            )}
          </div>
        </div>
      </details>
    </>
  );
}
