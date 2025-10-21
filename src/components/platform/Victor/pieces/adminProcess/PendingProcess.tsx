import React from "react";

import ProcessPill from "./ProcessPill";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminPendingProcess from "./AdminPendingProcess";
import { useAllPendingProcesses } from "@/hooks/useProcess";

export default function PendingProcess() {
  const { data, error, isLoading, mutate } = useAllPendingProcesses()
  const pendingProcesses = data?.payload || [];
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Solicitudes Pendientes</h1>
      </div>
      <div className="w-full">
        {pendingProcesses.map((process: any) => (
          <ProcessPill key={process.id} process={process} />
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <ModalForPreview title='Administrar Procesos'>
          <AdminPendingProcess />
        </ModalForPreview>
      </div>
    </div>
  );
}
