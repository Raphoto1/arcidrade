import React from "react";

import ProcessProfesional from "../pieces/ProcessProfesional";
import ModalForForms from "@/components/modals/ModalForForms";
import GenerateInvitation from "@/components/auth/GenerateInvitation";
export default function CampaignGenerateInvitations() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Generar Invitación</h1>
      </div>
      <ModalForForms title='Generar Invitación'>
        <GenerateInvitation />
      </ModalForForms>
    </div>
  );
}
