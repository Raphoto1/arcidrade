import React from "react";

import ProcessProfesional from "../pieces/ProcessProfesional";
import { useAllProcesses, useAllProfesionalsPostulatedByAddedBy, useProfesionalsListedInProcess } from "@/hooks/useProcess";
import { useProfesional } from "@/hooks/usePlatPro";

export default function ProcesAvailableInstitution() {
  const { data: profesionalsListedInProcess } = useAllProfesionalsPostulatedByAddedBy('profesional');
  console.log('profesionalsListedInProcess en victor', profesionalsListedInProcess);
  const filteredProfessionals = profesionalsListedInProcess?.payload.filter((profesional: any) => 
    profesional.added_by === 'profesional' && profesional.is_arcidrade === false
  ) || [];
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Procesos Solicitados Profesionales (en desarrollo)</h1>
      </div>
      <div className='max-h-100 overflow-auto'>
        {filteredProfessionals?.map((profesional: any) => (
          <ProcessProfesional key={profesional.id} processData={profesional.process_id} userId={profesional.profesional_id} />
        ))}
      </div>
      <div className='flex justify-center pt-2'>
        <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Administrar Solicitudes</button>
      </div>
    </div>
  );
}
