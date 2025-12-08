import React from 'react'
import InstitutionGridSearch from '../../institution/InstitutionGridSearch'

export default function ProfesionalsListVictor() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Profesionales Disponibles</h2>
      <InstitutionGridSearch isFake={false} />
    </div>
  )
}
