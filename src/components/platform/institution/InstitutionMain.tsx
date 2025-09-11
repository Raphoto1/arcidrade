import React from 'react'

import HeroHeaderInstitution from '../pieces/HeroHeaderInstitution'
import InstitutionManageGrid from './InstitutionManageGrid'
import ActiveProcess from './ActiveProcess'
import PendingProcess from './PendingProcess'
import InstitutionGridSearch from './InstitutionGridSearch'
export default function InstitutionMain() {
  return (
    <div className='flex flex-col justify-center items-center'>
      <HeroHeaderInstitution />
      <InstitutionManageGrid />
      <ActiveProcess />
      <PendingProcess />
      <InstitutionGridSearch />
    </div>
  )
}
