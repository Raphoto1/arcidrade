import React from "react";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "../Victor/AdminProcess";
import AdminInvitationsColab from "./AdminInvitationsColab";
import AdminInstitutions from "../Victor/AdminInstitutions";
import AdminProfesional from "../Victor/AdminProfesionals";

export default function AdminButtonsColab() {
  return (
    <div className='FatsActions w-full px-4 py-6'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-xl md:text-2xl font-bold text-center mb-4 fontArci'>
          Administración
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
          <ModalForPreview title='Administrar Procesos'>
            <AdminProcess />
          </ModalForPreview>
          <ModalForPreview title='Administrar Instituciones'>
            <AdminInstitutions />
          </ModalForPreview>
          <ModalForPreview title='Administrar Profesionales'>
            <AdminProfesional />
          </ModalForPreview>
          <ModalForPreview title='Administrar Invitaciones'>
            <AdminInvitationsColab />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
