import React from 'react'
import GridSearch from '../pieces/GridSearch'
import { useActiveProcesses } from '@/hooks/useProcess'
import ProcessesGridSearch from '../pieces/ProcessesGridSearch';

export default function Offers() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
          <h2 className='text-2xl fontArci text-center'>Ofertas Disponibles</h2>
      <ProcessesGridSearch isFake={ true} />
    </div>
  )
}
