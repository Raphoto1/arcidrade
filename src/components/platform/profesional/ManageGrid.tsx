import React from 'react'

import PersonalData from './PersonalData'
import Specialities from './Specialities'
import Certifications from './Certifications'
import Experiences from './Experiences'

export default function ManageGrid() {
  return (
    <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-4  md:h-[calc(100vh-8rem)]'>
      <PersonalData />
      <Specialities />
      <Certifications />
      <Experiences />
    </div>
  )
}
