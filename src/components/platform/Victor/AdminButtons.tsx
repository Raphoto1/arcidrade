import React from "react";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "./AdminProcess";
import AdminInvitations from "./AdminInvitations";
import AdminInstitutions from "./AdminInstitutions";
import AdminProfesional from "./AdminProfesionals";
export default function AdminButtons() {
  return (
    <div className='FatsActions md:flex grid justify-center'>
      <ModalForPreview title='Administrar Procesos'>
        <AdminProcess />
      </ModalForPreview>
      <ModalForPreview title='Administrar Invitaciones'>
        <AdminInvitations />
      </ModalForPreview>
      <ModalForPreview title='Administrar Instituciones'>
        <AdminInstitutions />
      </ModalForPreview>
      <ModalForPreview title='Administrar Profesionales'>
        <AdminProfesional />
      </ModalForPreview>
    </div>
  );
}
