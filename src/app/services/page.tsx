//imports app
import React from 'react'
import { servicesItems } from '@/static/data/staticData'
// imports project
//verificar info a cargar, generar o buscar imagenes en pexels
import ServiceDescription from '@/components/services/ServiceDescription'
export default function page() {
  return (
    <div>
      {servicesItems.map((item: any, index: number) => (
        <ServiceDescription key={index} title={item.title} longText={item.longText} mainImage={item.image} ExtraText={item.extraText} />
      ))}
    </div>
  )
}
