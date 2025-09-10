import React from "react";
import Image from "next/image";
export default function VictorHeroHeader() {
  //AJUSTAR IMAGEN DE FONDO Y ALINEADO EN MD
  return (
    <div>
      <Image
        src='https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp'
        className={`h-100 max-w-full absolute object-cover opacity-10 filter-blur-xl md:max-h-1/3 bg-gradient-to-b from-gray-200 to-transparent`}
        width={1000}
        height={1000}
        objectFit='cover'
        alt='fillImage'
      />
      <div className='HeroArea w-full md:flex flex-colum justify-center items-center align-middle p-2 md:pr-20'>
        <div className=' vacio none md:visible md:w-1/3 z-1'></div>
        <div className='avata grid justify-center align-middle items-center p-2 z-1 md:w-1/3'>
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
          <h2 className='text-xl font-bold font-var(--font-oswald) text-center p-2'>Victor</h2>
        </div>
        <div className='generalSpot bg-gray-200 p-4 rounded-sm z-10 md:w-1/3 items-center justify-center'>
          <h1 className='text-xl'>Informe General</h1>
          <div className='flex justify-between align-middle items-center p-2 w-xs bg-white rounded-md m-2'>
            <h3 className='text-(--main-arci)'>Procesos Activos</h3>
            <p>33</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-xs bg-white rounded-md m-2'>
            <h3 className='text-(--main-arci)'>Procesos Por Expirar</h3>
            <p>33</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-xs bg-white rounded-md m-2'>
            <h3 className='text-(--main-arci)'>Procesos Solicitados</h3>
            <p>33</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-xs bg-white rounded-md m-2'>
            <h3 className='text-(--main-arci)'>Procesos Finalizados</h3>
            <p>33</p>
          </div>
          <div className='flex justify-between align-middle items-center p-2 w-xs bg-white rounded-md m-2'>
            <h3 className='text-(--main-arci)'>Invitaciones Pendientes</h3>
            <p>33</p>
          </div>
        </div>
      </div>
    </div>
  );
}
