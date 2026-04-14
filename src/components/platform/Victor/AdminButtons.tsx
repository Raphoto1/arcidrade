import React from "react";
import { FaGlobe } from "react-icons/fa";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminProcess from "./AdminProcess";
import AdminInvitations from "./AdminInvitations";
import AdminInstitutions from "./AdminInstitutions";
import AdminProfesional from "./AdminProfesionals";
import WebAdmin from "./webAdmin/WebAdmin";

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
                <div className='w-full md:w-auto'>
          <ModalForPreview
            title='Administrar Home Page'
            icon={<FaGlobe className='text-lg shrink-0' />}
            btnClassName='btn h-auto w-auto py-2 px-3 min-w-full text-white font-bold tracking-widest uppercase shadow-lg border border-white/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-150'
            btnStyle={{ background: 'linear-gradient(135deg, var(--soft-arci) 0%, var(--main-arci) 100%)' }}
          >
            <WebAdmin />
          </ModalForPreview>
        </div>
      </div>
    </div>
  );
}
