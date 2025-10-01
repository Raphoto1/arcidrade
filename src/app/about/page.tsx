import React from "react";
import BrColors from "@/components/pieces/BrColors";
import DynamicThreeColumnGrid from "@/components/Grids/DynamicThreeColumnGrid";
import AboutItemCard from "@/components/about/AboutItemCard";
import { aboutItems } from "@/static/data/staticData";
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
