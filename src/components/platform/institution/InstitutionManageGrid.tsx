import React from 'react'

import InstitutionData from './InstitutionData'
import SpecialitiesInstitution from './SpecialitiesInstitution'
import CertificationsInstitution from './CertificationsInstitution'

export default function InstitutionManageGrid() {
  return (
    <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-4 md:max-h-3/4'>
      <InstitutionData />
      <SpecialitiesInstitution />
      <CertificationsInstitution />
      <CertificationsInstitution />
    </div>
  )
}
