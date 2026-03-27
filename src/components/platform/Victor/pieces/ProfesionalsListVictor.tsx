import React from 'react'
import InstitutionGridSearch from '../../institution/InstitutionGridSearch'

export default function ProfesionalsListVictor() {
  return (
    <div className='grid w-full max-w-full grid-cols-1 gap-4 overflow-x-hidden px-4 py-4 md:justify-center md:align-middle md:items-center'>
      <h2 className='px-2 text-center text-2xl fontArci'>Profesionales Disponibles</h2>
      <InstitutionGridSearch isFake={false} />
    </div>
  )
}
