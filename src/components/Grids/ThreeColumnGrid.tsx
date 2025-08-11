//imports app
import React from 'react'
//imports project

import InstitutionCard from '../pieces/InstitutionCard'

export default function ThreeColumnGrid() {
  return (
    <div className='threeColumnGrid flex justify-center flex-col items-center gap-4 md:grid md:grid-cols-3 md:max-w-11/12 md:justify-center'>
      <InstitutionCard />
      <InstitutionCard />
      <InstitutionCard />
      <InstitutionCard/>
      <InstitutionCard/>
      <InstitutionCard/>
    </div>
  )
}
