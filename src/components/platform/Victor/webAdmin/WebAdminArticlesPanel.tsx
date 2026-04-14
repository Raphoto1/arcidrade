import React from "react";
import WebAdminSectionCard from "@/components/platform/Victor/webAdmin/WebAdminSectionCard";

const articleItems = [
  {
    title: "Listado editorial",
    description: "Preparado para administrar títulos, extractos, categorías y orden de publicación.",
  },
  {
    title: "Portadas y recursos",
    description: "Espacio pensado para miniaturas, imágenes destacadas y carga de assets con Blob.",
  },
  {
    title: "SEO y distribución",
    description: "Más adelante podrá centralizar slug, meta descripción, destacados y visibilidad de cada artículo.",
  },
];

export default function WebAdminArticlesPanel() {
  return (
    <WebAdminSectionCard
      eyebrow='Futuro módulo'
      title='Artículos'
      description='Componente visual inicial para el futuro CMS editorial del blog o sección de contenido publicada.'
      status='Próximamente'
      accentClassName='bg-linear-to-r from-violet-500 to-fuchsia-500'
      preview={
        <div className='space-y-3'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='rounded-2xl bg-white p-4 shadow-sm'>
              <div className='h-3 w-1/4 rounded-full bg-violet-200' />
              <div className='mt-2 h-3 w-3/4 rounded-full bg-gray-200' />
              <div className='mt-2 h-3 w-full rounded-full bg-gray-200' />
            </div>
          ))}
        </div>
      }
      items={articleItems}
    />
  );
}