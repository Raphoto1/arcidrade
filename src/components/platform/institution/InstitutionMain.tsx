import React from 'react'

import HeroHeaderInstitution from '../pieces/HeroHeaderInstitution'
import InstitutionManageGrid from './InstitutionManageGrid'
import ActiveProcess from './ActiveProcess'
import PendingProcess from './PendingProcess'
import InstitutionGridSearch from './InstitutionGridSearch'
import FinishedProcess from './FinishedProcess'
import PausedProcess from './PausedProcess'
import { useInstitution } from '@/hooks/usePlatInst'

export default function InstitutionMain() {
  const { data, error, isLoading } = useInstitution();
  const isDeactivated = data?.payload?.auth?.status === 'desactivated';

  return (
    <div className='flex flex-col justify-center items-center'>
      <HeroHeaderInstitution />
      <InstitutionManageGrid />
      {!isDeactivated && (
        <>
          <ActiveProcess />
          <PendingProcess />
          <FinishedProcess />
          <PausedProcess />
          <InstitutionGridSearch />
        </>
      )}
    </div>
  )
}
