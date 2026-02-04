import React from 'react'
import ColabData from './pieces/ColabData'
import ProcessRequestedInstitution from './ProcessRequestedInstitution'
import ProcessRequestedProfesional from './ProcessRequestedProfesional'
import GenerateInvitationsColab from './GenerateInvitationsColab'

export default function ColabManageGrid() {
  return (
    <div className='flex flex-col gap-4'>
      {/* Primera fila: Datos, Procesos Instituciones y Procesos Profesionales */}
      <div className='flex justify-center'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-full w-full'>
          <ColabData />
          <ProcessRequestedInstitution />
          <ProcessRequestedProfesional />
        </div>
      </div>
      
      {/* Segunda fila: Manejo de Invitaciones */}
      <div className='flex justify-center'>
        <div className='w-full max-w-md px-4 pb-4'>
          <GenerateInvitationsColab />
        </div>
      </div>
    </div>
  )
}
