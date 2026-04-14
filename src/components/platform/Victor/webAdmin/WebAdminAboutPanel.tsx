import React from "react";
import WebAdminSectionCard from "@/components/platform/Victor/webAdmin/WebAdminSectionCard";

const aboutItems = [
  {
    title: "Narrativa de marca",
    description: "Controlar el relato principal, misión, visión y mensaje institucional de Arcidrade.",
  },
  {
    title: "Bloques de confianza",
    description: "Reservado para cifras, garantías, beneficios y elementos que refuercen credibilidad.",
  },
  {
    title: "Equipo y metodología",
    description: "Espacio para futuras fichas, pasos de trabajo y estructura editorial complementaria.",
  },
];

export default function WebAdminAboutPanel() {
  return (
    <WebAdminSectionCard
      eyebrow='Sección'
      title='About'
      description='Área pensada para administrar el contenido institucional y ordenar cómo se presenta la historia y propuesta de valor.'
      status='Diseño base'
      accentClassName='bg-linear-to-r from-[#ca8a04] to-[#f59e0b]'
      preview={
        <div className='rounded-2xl bg-white p-4 shadow-sm'>
          <div className='h-24 rounded-2xl bg-linear-to-br from-amber-100 to-orange-50' />
          <div className='mt-3 h-3 w-1/3 rounded-full bg-amber-200' />
          <div className='mt-2 h-3 w-full rounded-full bg-gray-200' />
          <div className='mt-2 h-3 w-5/6 rounded-full bg-gray-200' />
        </div>
      }
      items={aboutItems}
    />
  );
}