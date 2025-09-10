import React from 'react'

import Grid from '../pieces/Grid'
import ProfesionalCard from '@/components/pieces/ProfesionalCard'

export default function FinishedProcess() {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1 gap-4 mt-4 pt-0 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center md:w-4/5 bg-gray-100'>
        <div className='flex justify-around bg-gray-300 rounded-t-md p-2 flex-col md:flex-row'>
          <span></span>
         <h2 className='text-2xl fontArci text-center bg-gray-300 rounded-t-md'>Procesos Finalizados</h2>
         <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Administrar Procesos</button>
       </div>
        <div className='flex justify-center flex-col md:flex-row'>
          <div className='flex justify-between w-3/4 flex-col md:flex-row'>
            <div className='flex'>
              <h3 className='font-bold fontArci '>Cargo:</h3>
              <p className='fontRoboto text-(--main-arci)'>Cirujano</p>
            </div>
            <div className='flex'>
              <h3 className='font-bold fontArci '>Cliente:</h3>
              <p className='fontRoboto text-(--main-arci)'>Clinica Toledo</p>
            </div>
            <div>
             <div className='controles flex'>
                <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Detalle</button>
                <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Reactivar</button>
              <button className='btn bg-[var(--orange-arci)] text-sm h-auto'>Eliminar Proceso</button>
            </div>
            </div>
          </div>
        </div>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
        </Grid>
      </div>
    </div>
  )
}
