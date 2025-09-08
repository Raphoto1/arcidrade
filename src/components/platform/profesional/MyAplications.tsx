import React from 'react'

import Grid from '../pieces/Grid'
import InstitutionCard from '@/components/pieces/InstitutionCard'

export default function MyAplications() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
      <h2 className='text-2xl fontArci text-center'>Mis Aplicaciones</h2>
      <Grid>
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
        <InstitutionCard />
      </Grid>
    </div>
  )
}
