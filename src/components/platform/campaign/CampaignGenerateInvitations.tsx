import React from "react";

import ProcessProfesional from "../pieces/ProcessProfesional";
import ModalForForms from "@/components/modals/ModalForForms";
import GenerateInvitation from "@/components/auth/GenerateInvitation";
import GenerateSingleInvitation from "@/components/forms/platform/victor/GenerateSingleInvitation";
export default function CampaignGenerateInvitations() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Generar Invitación</h1>
      </div>
      <div className="tooltip tooltip-bottom w-full" data-tip="Crea invitaciones Personales con registro en base de datos">
        <ModalForForms title='Generar Invitación'>
          <GenerateInvitation />
        </ModalForForms>
      </div>
      <div className="tooltip tooltip-bottom w-full" data-tip="Genera una invitación individual sin registro en base de datos">
        <ModalForForms title='Generar Invitación sin Suscripción'>
          <GenerateSingleInvitation />
        </ModalForForms>
      </div>
    </div>
  );
}
