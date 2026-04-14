import React from "react";
import WebAdminSectionCard from "@/components/platform/Victor/webAdmin/WebAdminSectionCard";

const servicesItems = [
  {
    title: "Catálogo de servicios",
    description: "Preparado para listar servicios, resúmenes, beneficios y jerarquías comerciales.",
  },
  {
    title: "Tarjetas y detalle",
    description: "Zona visual para definir cards, copys cortos y enlaces a explicaciones más profundas.",
  },
  {
    title: "Llamados a la acción",
    description: "Ubicación prevista para botones, formularios y módulos de contacto asociados a cada servicio.",
  },
];

export default function WebAdminServicesPanel() {
  return (
    <WebAdminSectionCard
      eyebrow='Sección'
      title='Servicios'
      description='Base para una futura administración comercial del sitio, con foco en servicios, beneficios y recorridos de conversión.'
      status='Listo para maquetar'
      accentClassName='bg-linear-to-r from-sky-500 to-cyan-400'
      preview={
        <div className='grid gap-2'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='h-20 rounded-2xl bg-sky-100' />
            <div className='h-20 rounded-2xl bg-cyan-50' />
          </div>
          <div className='rounded-2xl bg-white p-4 shadow-sm'>
            <div className='h-3 w-1/2 rounded-full bg-sky-200' />
            <div className='mt-2 h-3 w-full rounded-full bg-gray-200' />
            <div className='mt-2 h-3 w-4/5 rounded-full bg-gray-200' />
          </div>
        </div>
      }
      items={servicesItems}
    />
  );
}