import React from "react";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "./AdminProcess";
import AdminInvitations from "./AdminInvitations";
export default function AdminButtons() {
  return (
    <div className='FatsActions md:flex grid justify-center'>
      <ModalForPreview title='Administrar Procesos'>
        <AdminProcess />
      </ModalForPreview>
      <ModalForPreview title='Administrar Invitaciones'>
        <AdminInvitations />
      </ModalForPreview>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Instituciones</button>
      <button className='btn bg-[var(--main-arci)] text-white text-2xl h-auto p-2'>Administrar Profesionales</button>
    </div>
  );
}
