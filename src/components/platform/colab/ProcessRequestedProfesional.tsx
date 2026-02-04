import React from "react";
import ProcessProfesional from "../pieces/ProcessProfesional";
import { useAllProfesionalsPostulatedByAddedBy } from "@/hooks/useProcess";
import Loader from "@/components/pieces/Loader";

export default function ProcessRequestedProfesional() {
  const { data: profesionalsListedInProcess, isLoading, error } = useAllProfesionalsPostulatedByAddedBy('profesional');
  
  const filteredProfessionals = profesionalsListedInProcess?.payload.filter((profesional: any) => 
    profesional.added_by === 'profesional' && profesional.is_arcidrade === false
  ) || [];

  if (isLoading) {
    return (
      <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
        <div className='pb-2'>
          <h1 className='text-lg md:text-xl fontArci text-center'>Procesos Solicitados Profesionales</h1>
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
          <h1 className='text-lg md:text-xl fontArci text-center'>Procesos Solicitados Profesionales</h1>
        </div>
        <div className='text-center text-red-600 py-4 text-sm md:text-base'>Error al cargar los procesos</div>
      </div>
    );
  }

  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-lg md:text-xl fontArci text-center'>
          Procesos Solicitados Profesionales
          <span className='text-xs md:text-sm font-normal text-gray-600 ml-2'>({filteredProfessionals.length})</span>
        </h1>
      </div>
      <div className='max-h-80 md:max-h-96 overflow-auto'>
        {filteredProfessionals.length > 0 ? (
          filteredProfessionals.map((profesional: any) => (
            <ProcessProfesional key={profesional.id} processData={profesional.process_id} userId={profesional.profesional_id} />
          ))
        ) : (
          <div className='text-center py-8 text-gray-500 text-sm md:text-base'>No hay procesos solicitados por profesionales</div>
        )}
      </div>
    </div>
  );
}
