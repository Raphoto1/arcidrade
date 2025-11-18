'use client'
import React from "react";
import { ImSearch } from "react-icons/im";

import InstitutionPill from "./InstitutionPill";
import { useAllPausedInstitutions } from "@/hooks/usePlatInst";

export default function PausedInstitutions() {
  const {data, isLoading, error} = useAllPausedInstitutions();
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Instituciones Pausadas</h1>
      </div>
      <div className='barraDeBusqueda flex justify-center mb-4 items-center'>
        <input type='text' placeholder='Buscar ofertas...' className='p-2 border border-gray-300 rounded-md mr-2' />
        <ImSearch size={30} />
      </div>
      <div>
        {data?.payload.length === 0 && !isLoading && <p key="empty" className="text-center">No hay instituciones pausadas.</p>}
        {isLoading && <p key="loading" className="text-center">Cargando instituciones pausadas...</p>}
        {error && <p key="error" className="text-center text-red-500">Error al cargar las instituciones pausadas.</p>}
        {data?.payload.map((institution: any) => (
          <InstitutionPill key={institution.referCode} institution={institution.referCode} />
        ))}
      </div>
    </div>
  );
}
