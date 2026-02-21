import React from "react";
import ProcessInstitution from "../pieces/ProcessInstitution";
import { useAllPendingProcesses } from "@/hooks/useProcess";
import Loader from "@/components/pieces/Loader";

export default function ProcessRequestedInstitution() {
  const { data, error, isLoading, mutate } = useAllPendingProcesses();
  const filteredCount = data?.payload?.length || 0;
  
  if (isLoading) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-lg md:text-xl fontArci text-center'>Procesos Solicitados Instituciones</h1>
        </div>
        <div className='flex justify-center items-center h-32'>
          <Loader size="md" text="" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-lg md:text-xl fontArci text-center'>Procesos Solicitados Instituciones</h1>
        </div>
        <div className='text-center text-red-600 py-4 text-sm md:text-base'>Error al cargar los procesos</div>
      </div>
    );
  }

  const processes = data?.payload || [];

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-lg md:text-xl fontArci text-center'>
          Procesos Solicitados Instituciones
          <span className='text-xs md:text-sm font-normal text-gray-600 ml-2'>({filteredCount})</span>
        </h1>
      </div>
      <div className='max-h-80 md:max-h-96 overflow-auto'>
        {processes.length > 0 ? (
          processes.map((process: any, index: number) => <ProcessInstitution process={process} onSuccess={mutate} key={process.id || index} />)
        ) : (
          <div className='text-center py-8 text-gray-500 text-sm md:text-base'>No hay procesos pendientes de instituciones</div>
        )}
      </div>
    </div>
  );
}
