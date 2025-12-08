import React from "react";
import Image from "next/image";
import GeneralReport from "./GeneralReport";
import InvitationsReport from "./InvitationsReport";

export default function VictorHeroHeader() {
  return (
    <div className='relative w-full min-h-[340px] overflow-visible'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10 min-h-[340px]'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />
      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[160px] bg-gradient-to-t from-white via-transparent to-transparent' />

      {/* Contenido principal - Stack en móvil, horizontal en desktop */}
      <div className='HeroArea w-full flex flex-col md:flex-row justify-between items-stretch p-2 md:pr-5 relative z-10 gap-4 md:gap-4 min-h-[340px]'>
        {/* Sección de Invitaciones */}
        <div className='w-full md:w-1/3 flex items-start justify-center'>
          <InvitationsReport />
        </div>

        {/* Avatar de Victor */}
        <div className='avatar flex flex-col justify-center items-center p-2 z-10 w-full md:w-1/3'>
          <div className='relative w-32 md:w-40 h-32 md:h-40 mb-2'>
            <Image
              src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
              className='w-full h-full rounded-full object-cover'
              width={500}
              height={500}
              alt='Victor Profile Image'
            />
          </div>
          <h2 className='text-lg md:text-xl font-bold font-var(--font-oswald) text-center p-2 capitalize'>Victor</h2>
        </div>

        {/* Informe General */}
        <div className='w-full md:w-1/3 flex items-start justify-center'>
          <GeneralReport />
        </div>
      </div>
    </div>
  );
}
