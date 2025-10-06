import React from 'react'

export default function ProcessBasic(props: any) {
    
  return (
          <div className='flex justify-between align-middle bg-gray-100 items-center'>
        <div className='flex justify-start align-middle bg-gray-100 items-center'>
          <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Cargo:</h2>
          <p className='text-center fontRoboto text-(--main-arci) align-middle'>{props.position}</p>
        </div>
        <div className='botones'>
          <div className='flex justify-end align-middle bg-gray-100 pr-2'>
            <p className='fontRoboto text-center text-(--dark-gray)'>Plazo: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle'>35 dias</p>
          </div>
          <div className='flex-wrap justify-between gap-2 md:p-2'>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extención</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Ver Proceso</button>
            <button className='btn bg-amber-300 text-white text-sm h-auto'>Pausar Proceso</button>
            <button className='btn bg-[var(--orange-arci)] text-white text-sm h-auto'>Eliminar Proceso</button>
          </div>
        </div>
      </div>
  )
}
