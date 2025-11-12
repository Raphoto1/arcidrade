import React from "react";
import BrColors from "@/components/pieces/BrColors";
import DynamicThreeColumnGrid from "@/components/Grids/DynamicThreeColumnGrid";
import AboutItemCard from "@/components/about/AboutItemCard";
import { aboutItems } from "@/static/data/staticData";
import { generatePageMetadata } from "@/config/metadata";

// SEO optimizada para la página About
export const metadata = generatePageMetadata(
  "Acerca de Nosotros - Nuestra Misión en el Sector Sanitario",
  "Conoce la historia, misión y valores de Arcidrade. Descubre cómo estamos transformando la conexión entre profesionales de la salud e instituciones sanitarias en España.",
  [
    "misión arcidrade",
    "historia plataforma sanitaria",
    "valores empresa salud",
    "equipo arcidrade",
    "visión sanitaria",
    "innovación salud",
    "empresa tecnología médica",
    "startup salud España"
  ],
  undefined,
  "/about"
);

export default function page() {
  return (
    <div>
      <BrColors title='Acerca de Nosotros' />
      <section className='flex justify-center max-w-7xl mx-auto p-4'>
        <DynamicThreeColumnGrid>
          {aboutItems.map((item: any, index: number) => (
            <AboutItemCard title={item.title} description={item.description} image={item.image} key={index} />
          ))}
        </DynamicThreeColumnGrid>
      </section>
    </div>
  );
}
