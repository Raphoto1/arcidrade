import React from "react";

import ModalForForms from "@/components/modals/ModalForForms";
import GenerateInvitationVictor from "@/components/auth/GenerateInvitationVictor";
export default function GenerateInvitations() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Generar Invitación</h1>
      </div>
      <div className="flex flex-col justify-center pt-2 gap-2">
        <ModalForForms title="Generar Invitacion">
          <GenerateInvitationVictor />
        </ModalForForms>
        {/* <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto w-full p-2'>Invitar Profesional</button>
        <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto w-full p-2'>Invitar Institución</button>
        <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto w-full p-2'>Invitar Seleccion</button> */}
      </div>
    </div>
  );
}
