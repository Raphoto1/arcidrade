'use client'
import React from "react";
import { ImSearch } from "react-icons/im";

import InstitutionPill from "./InstitutionPill";
import { useAllActiveInstitutions } from "@/hooks/usePlatInst";
import ModalForForms from "@/components/modals/ModalForForms";
import ExportInstitutionsExcelForm from "@/components/forms/platform/institution/ExportInstitutionsExcelForm";

export default function ActiveInstitutions() {
  const {data, isLoading, error} = useAllActiveInstitutions();
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-2xl fontArci text-center md:text-left'>Instituciones Activas</h1>
        <div className='w-full md:w-44'>
          <ModalForForms title='Exportar Excel'>
            <ExportInstitutionsExcelForm
              institutions={data?.payload || []}
              categoryLabel='Activas'
              fileBaseName='instituciones-activas'
              status='active'
            />
          </ModalForForms>
        </div>
      </div>
      <div className='barraDeBusqueda flex justify-center mb-4 items-center'>
        <input type='text' placeholder='Buscar instituciones...' className='p-2 border border-gray-300 rounded-md mr-2' />
        <ImSearch size={30} />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {data?.payload?.map((institution: any) => (
          <InstitutionPill key={institution.referCode} institution={institution.referCode} />
        ))}
      </div>
    </div>
  );
}
