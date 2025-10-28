import React from "react";

import ModalForForms from "@/components/modals/ModalForForms";
import GenerateInvitationVictor from "@/components/auth/GenerateInvitationVictor";
import AdminInvitations from "./AdminInvitations";
import ModalForPreview from "@/components/modals/ModalForPreview";
import GenerateMasiveInvitationsNoSus from "@/components/forms/platform/victor/GenerateMasiveInvitationsNoSus";
import GenerateMasiveInvitationsSus from "@/components/forms/platform/victor/GenerateMasiveInvitationsSus";
export default function GenerateInvitations() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Generar Invitación</h1>
      </div>
      <div className='flex flex-col justify-center pt-2 gap-2'>
        <ModalForForms title='Generar Invitacion'>
          <GenerateInvitationVictor />
        </ModalForForms>
        <ModalForPreview title='Administrar Invitaciones'>
          <AdminInvitations />
        </ModalForPreview>
        <ModalForForms title='Generar Invitaciones Masivas Sin Suscripción'>
          <GenerateMasiveInvitationsNoSus />
        </ModalForForms>
        <ModalForForms title='Generar Invitaciones Masivas Con Suscripción'>
          <GenerateMasiveInvitationsSus />
        </ModalForForms>
      </div>
    </div>
  );
}
