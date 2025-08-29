import React from "react";
import Image from "next/image";
export default function HeroHeader() {
    //AJUSTAR IMAGEN DE FONDO Y ALINEADO EN MD
  return (
    <div>
          <div className='HeroArea w-full flex justify-center items-center align-middle p-2'>
        
        <Image
          src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
          className='h-100 max-w-full absolute object-cover opacity-10 filter-blur-xl'
          width={1000}
          height={1000}
          objectFit='cover'
          alt='fillImage'
        />
        <div className='avata grid justify-center align-middle items-center p-2 z-1'>
          <Image
            src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
            className='w-50 h-50 max-w-96 rounded-full'
            width={500}
            height={500}
            objectFit='cover'
            alt='fillImage'
          />
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2'>Nombre de Medico con Apellido</h2>
        </div>
        <div className='description bg-gray-200 p-4 rounded-sm z-1'>
          <h3 className='text-xl font-bold font-var(--font-oswald)'>Presentación</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolorem unde vero id dolor magnam minus aliquam. Cupiditate ipsam dolorum amet
            exercitationem voluptates vitae excepturi!
          </p>
          <div className='grid justify-end mt-5'>
            <button className='btn bg-[var(--soft-arci)] justify-end'>Actualizar</button>
          </div>
        </div>
      </div>
      <div className='options grid justify-center'>
        <h3 className='text-xl text-center'>titulo de carrera</h3>
        <div>
          <button className='btn bg-[var(--main-arci)] text-white'>Buscando Ofertas</button>
          <button className='btn bg-[var(--main-arci)] text-white'>Disponible Para trabajar</button>
        </div>
      </div>
    </div>
  );
}
