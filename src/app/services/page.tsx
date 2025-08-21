//imports app
import React from 'react'

// imports project
//verificar info a cargar, generar o buscar imagenes en pexels
import ServiceDescription from '@/components/services/ServiceDescription'
export default function page() {
  return (
    <div>
      <ServiceDescription title='Procurement' ExtraText='Conectamos Oportunidades de Negocio on soluciones reales' mainImage='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'/>
      <ServiceDescription title='Consultoria' ExtraText='Facilitamos su entrada y exito en mercados clave' mainImage='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'/>
    </div>
  )
}
