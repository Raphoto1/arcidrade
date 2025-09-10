import React from "react";

import ProcessInstitution from "../pieces/ProcessInstitution";

export default function ProcesAvailableInstitution() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Procesos Solicitados Instituciones</h1>
      </div>
      <div className="max-h-100 overflow-auto">
        <ProcessInstitution />
        <ProcessInstitution />
        <ProcessInstitution />
        <ProcessInstitution />
      </div>
      <div className="flex justify-center pt-2">
         <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Administrar Solicitudes</button>
      </div>
    </div>
  );
}
