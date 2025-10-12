import React from "react";

import ProcessInstitution from "../pieces/ProcessInstitution";
import { useAllPendingProcesses } from "@/hooks/useProcess";

export default function ProcesAvailableInstitution() {
  const { data, error, isLoading, mutate } = useAllPendingProcesses()
  const filteredCount = data?.payload?.length || 0;
  if (isLoading) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>Procesos Solicitados Instituciones</h1>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="loading loading-spinner loading-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-2xl fontArci text-center'>Procesos Solicitados Instituciones</h1>
        </div>
        <div className="text-center text-red-600 py-4">
          Error al cargar los procesos
        </div>
      </div>
    );
  }

  const processes = data?.payload || [];
  
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>
          Procesos Solicitados Instituciones 
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({filteredCount})
          </span>
        </h1>
      </div>
      <div className="max-h-100 overflow-auto">
        {processes.length > 0 ? (
          processes.map((process: any, index: number) => (
            <ProcessInstitution 
              process={process}
              key={process.id || index}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay procesos pendientes de instituciones
          </div>
        )}
      </div>
      <div className="flex justify-center pt-2">
         <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>
           Administrar Solicitudes
         </button>
      </div>
    </div>
  );
}
