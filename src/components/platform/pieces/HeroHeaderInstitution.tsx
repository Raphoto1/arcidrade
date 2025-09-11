import React from "react";
import Image from "next/image";

import ModalForPreview from "@/components/modals/ModalForPreview";
import InstitutionDetail from "./institutionDetail";
import InstitutionDetailFull from "./InstitutionDetailFull";
export default function HeroHeaderInstitution() {
  //AJUSTAR IMAGEN DE FONDO Y ALINEADO EN MD
  return (
    <div className='relative w-full md:h-[320px] overflow-hidden'>
      {/* Imagen de fondo con opacidad */}
      <div
        className='absolute inset-0 bg-cover bg-center opacity-10'
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg')",
        }}
      />

      {/* Degradado inferior hacia transparente */}
      <div className='absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white via-transparent to-transparent' />

      {/* Contenido principal */}
      <div className='HeroArea w-full flex justify-center items-center align-middle p-2 md:pr-20 relative z-10'>
        <div className='vacio none md:visible md:w-1/3 z-10'></div>
        <div className='avata grid justify-center align-middle items-center p-2 z-10 md:w-1/3'>
          <div className='flex justify-center align-middle items-center'>
            <Image
              src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
              className='w-40 h-40 max-w-96 rounded-full justify-center align-middle items-center'
              width={500}
              height={500}
              objectFit='cover'
              alt='fillImage'
            />
          </div>
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2'>Nombre de Hospital</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-10 md:w-1/3'>
          <h3 className='text-xl font-bold font-var(--font-oswald)'>Presentación</h3>
          <p className='text-sm max-height-10'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem unde vero id dolor magnam minus aliquam. Cupiditate ipsam dolorum amet
            exercitationem voluptates vitae excepturi!
          </p>
          <div className='grid justify-end mt-5'>
            <button className='btn bg-[var(--soft-arci)] justify-end'>Actualizar</button>
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className='options grid justify-center relative z-10'>
        <h3 className='text-xl text-center'>titulo de carrera</h3>
        <div className="flex">
          <ModalForPreview title={"Preview"}>
            <InstitutionDetail />
          </ModalForPreview>
          <ModalForPreview title={"Preview Full"}>
            <InstitutionDetailFull />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
