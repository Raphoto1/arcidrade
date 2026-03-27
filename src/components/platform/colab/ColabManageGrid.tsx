"use client"
import React from 'react'
import ColabData from './pieces/ColabData'
import ProcessRequestedInstitution from './ProcessRequestedInstitution'
import ProcessRequestedProfesional from './ProcessRequestedProfesional'
import GenerateInvitationsColab from './GenerateInvitationsColab'
import { useColab } from '@/hooks/useColab'

export default function ColabManageGrid() {
  const { data } = useColab()
  const colabData = Array.isArray(data?.payload) ? data?.payload[0] : data?.payload || {}
  const hasPersonalName = Boolean(colabData?.name && colabData?.last_name)

  return (
    <div className='flex justify-center'>
      <div className={`grid grid-cols-1 ${hasPersonalName ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4 p-4 max-w-full w-full`}>
        {!hasPersonalName && <ColabData />}
        <ProcessRequestedInstitution />
        <ProcessRequestedProfesional />
        <GenerateInvitationsColab />
      </div>
    </div>
  )
}
