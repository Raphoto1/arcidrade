import React from "react";
import WebAdminSectionCard from "@/components/platform/Victor/webAdmin/WebAdminSectionCard";

const aboutItems = [
  {
    title: "Identidad y propósito",
    description: "Presentación clara de la historia institucional, propósito y visión de servicio.",
  },
  {
    title: "Cómo trabajamos",
    description: "Resumen del enfoque metodológico, acompañamiento y criterios de calidad.",
  },
  {
    title: "Compromiso con resultados",
    description: "Bloque para evidenciar impacto, confianza y valor entregado a cada institución.",
  },
];

export default function WebAdminAboutPanel() {
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    image: "",
    alt: "",
    order: "1",
    status: "draft",
  });

  const previewTitle = form.title || "Título de card";
  const previewDescription = form.description || "Aquí se verá una descripción breve de la propuesta de valor de esta card.";
  const previewAlt = form.alt || "Imagen de previsualización";
  const hasDraftCard = Boolean(form.title.trim() || form.description.trim() || form.image.trim());

  const sectionPreviewItems = [
    ...aboutItems.map((item, index) => ({
      title: item.title,
      description: item.description,
      image: "",
      alt: item.title,
      order: index + 1,
      status: "published",
    })),
    ...(hasDraftCard ? [
      {
        title: previewTitle,
        description: previewDescription,
        image: form.image,
        alt: previewAlt,
        order: Number(form.order) > 0 ? Number(form.order) : aboutItems.length + 1,
        status: form.status,
      },
    ] : []),
  ].sort((a, b) => a.order - b.order);

  return (
    <WebAdminSectionCard
      eyebrow='Sección'
      title='About'
      description='Área pensada para administrar el contenido institucional y ordenar cómo se presenta la historia y propuesta de valor.'
      status='En edición'
      accentClassName='bg-linear-to-r from-[#ca8a04] to-[#f59e0b]'
      preview={
        <section className='rounded-2xl bg-white p-4 shadow-sm'>
          <div className='rounded-2xl bg-linear-to-r from-amber-100 to-orange-50 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-amber-700'>Sección About</p>
            <h3 className='mt-1 font-oswald text-xl text-(--main-arci)'>Quiénes Somos</h3>
            <p className='mt-1 text-sm leading-6 text-gray-700'>
              Vista previa completa de la sección con las cards actuales y la card en edición.
            </p>
          </div>

          <div className='mt-4 grid gap-3 md:grid-cols-2'>
            {sectionPreviewItems.map((item) => (
              <article key={`${item.title}-${item.order}`} className='overflow-hidden rounded-2xl border border-gray-100 bg-white'>
                <div className='relative h-28 w-full bg-linear-to-br from-amber-100 via-orange-50 to-amber-200'>
                  {item.image ? (
                    <img src={item.image} alt={item.alt} className='h-full w-full object-cover' />
                  ) : (
                    <div className='absolute inset-0 grid place-items-center'>
                      <span className='rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700'>
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>

                <div className='p-3'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500'>
                      Orden {item.order}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        item.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status === "published" ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                  <h4 className='mt-2 font-semibold text-(--main-arci)'>{item.title}</h4>
                  <p className='mt-1 text-sm leading-6 text-gray-600 line-clamp-2'>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      }
      items={aboutItems}
      extraContent={
        <section className='rounded-2xl border border-amber-200 bg-amber-50/60 p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.16em] text-amber-700'>Agregar card About</p>

          <form className='mt-4 grid gap-3 sm:grid-cols-2' onSubmit={(e) => e.preventDefault()}>
            <label className='form-control sm:col-span-2'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                Título
              </span>
              <input
                type='text'
                className='input input-bordered input-sm w-full bg-white'
                placeholder='Ej. Diagnóstico con enfoque multidisciplinar'
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </label>

            <label className='form-control sm:col-span-2'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                Descripción
              </span>
              <textarea
                className='textarea textarea-bordered textarea-sm min-h-24 w-full bg-white'
                placeholder='Resumen breve del valor de esta card para la sección About.'
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </label>

            <label className='form-control'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                URL de imagen
              </span>
              <input
                type='url'
                className='input input-bordered input-sm w-full bg-white'
                placeholder='https://...'
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              />
            </label>

            <label className='form-control'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                Alt de imagen
              </span>
              <input
                type='text'
                className='input input-bordered input-sm w-full bg-white'
                placeholder='Texto alternativo accesible'
                value={form.alt}
                onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
              />
            </label>

            <label className='form-control'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                Orden
              </span>
              <input
                type='number'
                min={1}
                className='input input-bordered input-sm w-full bg-white'
                placeholder='1'
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
              />
            </label>

            <label className='form-control'>
              <span className='label-text text-xs font-semibold uppercase tracking-[0.12em] text-gray-500'>
                Estado
              </span>
              <select
                className='select select-bordered select-sm w-full bg-white'
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value='draft'>Borrador</option>
                <option value='published'>Publicado</option>
              </select>
            </label>

            <div className='sm:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-white p-3'>
              <p className='text-xs leading-5 text-gray-500'>
                Completa los campos para actualizar la vista previa de la sección.
              </p>
              <button type='submit' className='btn btn-sm text-white' style={{ backgroundColor: "var(--main-arci)" }}>
                Guardar card
              </button>
            </div>
          </form>
        </section>
      }
    />
  );
}