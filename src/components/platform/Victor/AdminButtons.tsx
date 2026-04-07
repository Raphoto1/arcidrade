import React from "react";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "./AdminProcess";
import AdminInvitations from "./AdminInvitations";
import AdminInstitutions from "./AdminInstitutions";
import AdminProfesional from "./AdminProfesionals";

export default function AdminButtons() {
  return (
    <div className='FatsActions w-full rounded-sm bg-gray-200 p-2'>
      <h1 className='text-center text-2xl fontArci'>Administración</h1>
      <div className='mt-2 grid w-full grid-cols-1 gap-2 md:flex md:flex-wrap md:justify-center'>
        <div className='w-full md:w-auto'>
          <ModalForPreview title='Administrar Procesos'>
            <AdminProcess />
          </ModalForPreview>
        </div>
        <div className='w-full md:w-auto'>
          <ModalForPreview title='Administrar Instituciones'>
            <AdminInstitutions />
          </ModalForPreview>
        </div>
        <div className='w-full md:w-auto'>
          <ModalForPreview title='Administrar Profesionales'>
            <AdminProfesional />
          </ModalForPreview>
        </div>
        <div className='w-full md:w-auto'>
          <ModalForPreview title='Administrar Invitaciones'>
            <AdminInvitations />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
