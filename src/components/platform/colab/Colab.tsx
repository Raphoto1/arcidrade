import React, { Suspense } from 'react'
import ColabHeroHeader from './ColabHeroHeader'
import ColabManageGrid from './ColabManageGrid'
import AdminButtonsColab from './AdminButtonsColab'
import ModalForForms from '@/components/modals/ModalForForms'
import CreateProcessForm from '@/components/forms/platform/process/CreateProcessForm'
import AskedProcess from '../Victor/AskedProcess'
import ActiveProcess from '../Victor/ActiveProcess'
import PausedProcess from '../Victor/PausedProcess'
import ArchivedProcess from '../Victor/ArchivedProcess'
import FinishedProcess from '../Victor/FinishedProcess'
import ProcessListVictor from '../Victor/pieces/ProcessListVictor'
import ProfesionalsListVictor from '../Victor/pieces/ProfesionalsListVictor'
import InstitutionsListVictor from '../Victor/pieces/InstitutionsListVictor'
import Offers from '../profesional/Offers'
import Loader from '@/components/pieces/Loader'

const LoadingFallback = () => <Loader size="lg" text="Cargando..." className="p-4" />;

const LoadingOffers = () => (
  <div className='grid grid-cols-1 gap-4 p-4 md:max-h-3/4 md:justify-center md:align-middle md:items-center'>
    <h2 className='text-2xl fontArci text-center'>Ofertas Disponibles</h2>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='bg-gray-200 rounded-lg h-48 animate-pulse'></div>
      ))}
    </div>
  </div>
);

export default function Colab() {
  return (
    <div>
      <ColabHeroHeader />
      <ColabManageGrid />
      <AdminButtonsColab />
      <div className='max-w-2xl mx-auto my-4 px-4'>
        <ModalForForms title='Crear Proceso Directo'>
          <CreateProcessForm />
        </ModalForForms>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <AskedProcess />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ActiveProcess />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <PausedProcess />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ArchivedProcess />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <FinishedProcess />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ProcessListVictor />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <ProfesionalsListVictor />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <InstitutionsListVictor />
      </Suspense>
    </div>
  )
}
