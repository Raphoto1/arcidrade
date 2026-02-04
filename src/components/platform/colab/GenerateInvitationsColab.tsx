import React from "react";
import ModalForForms from "@/components/modals/ModalForForms";
import ModalForPreview from "@/components/modals/ModalForPreview";
import GenerateInvitationColab from "@/components/auth/GenerateInvitationColab";
import AdminInvitationsColab from "./AdminInvitationsColab";
import GenerateSingleInvitation from "@/components/forms/platform/victor/GenerateSingleInvitation";
import GenerateMasiveInvitationsNoSus from "@/components/forms/platform/victor/GenerateMasiveInvitationsNoSus";
import GenerateMasiveInvitationsSus from "@/components/forms/platform/victor/GenerateMasiveInvitationsSus";
import RemindPendingInvitations from "@/components/platform/Victor/RemindPendingInvitations";

export default function GenerateInvitationsColab() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-lg p-3 md:p-4 md:justify-center md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-lg md:text-xl fontArci text-center'>Generar Invitación</h1>
      </div>
      <div className='flex flex-col justify-center pt-2 gap-2'>
        <ModalForForms title='Generar Invitación'>
          <GenerateInvitationColab />
        </ModalForForms>
        <ModalForForms title='Generar Invitación Sin Suscripción'>
          <GenerateSingleInvitation />
        </ModalForForms>
        <ModalForForms title='Generar Invitaciones Masivas Sin Suscripción'>
          <GenerateMasiveInvitationsNoSus />
        </ModalForForms>
        <ModalForForms title='Generar Invitaciones Masivas Con Suscripción'>
          <GenerateMasiveInvitationsSus />
        </ModalForForms>
        <ModalForForms title='Recordar Invitaciones Pendientes'>
          <RemindPendingInvitations />
        </ModalForForms>
        <ModalForPreview title='Administrar Invitaciones'>
          <AdminInvitationsColab />
        </ModalForPreview>
      </div>
    </div>
  );
}
