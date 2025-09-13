import React from "react";

import InvitationPill from "./InvitationPill";

export default function ArchivedInvitations() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Archivadas</h1>
      </div>
      <div className='flex flex-col justify-center md:gap-1 md:h-auto align-middle items-center'>
        <label htmlFor=''>Filtrar por tipo:</label>
        <select name='' id='' className='select select-bordered w-3/4 mb-2'>
          <option value=''>Profesional</option>
          <option value=''>Institución</option>
          <option value=''>Selección</option>
        </select>
      </div>
      <div>
        <InvitationPill />
      </div>
    </div>
  );
}
