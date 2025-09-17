import React from "react";

import ProcessPill from "./ProcessPill";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminPendingProcess from "./AdminPendingProcess";

export default function PendingProcess() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Pendientes</h1>
      </div>
      <div>
        <ProcessPill />
      </div>
      <div className="flex justify-center pt-2">
        <ModalForPreview title='Administrar Procesos'>
          <AdminPendingProcess />
        </ModalForPreview>
      </div>
    </div>
  );
}
