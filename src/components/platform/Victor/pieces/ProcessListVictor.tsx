import React from 'react'
import ProcessesGridSearch from '../../pieces/ProcessesGridSearch'

export default function ProcessListVictor() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Ofertas Disponibles</h2>
      <ProcessesGridSearch isFake={false} applyButton={false} />
    </div>
  )
}
