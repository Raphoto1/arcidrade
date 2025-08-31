import React from 'react'

import PersonalData from './PersonalData'

export default function ManageGrid() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
      <PersonalData />
      <PersonalData />
      <PersonalData />
      <PersonalData />
    </div>
  )
}
