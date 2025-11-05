import React from "react";

import ProcessPill from "./ProcessPill";
import { useAllActiveProcesses } from "@/hooks/useProcess";
import ModalForPreview from "@/components/modals/ModalForPreview";
import AdminPendingProcess from "./AdminPendingProcess";

export default function ActiveProcess() {
  const { data, error, isLoading, mutate } = useAllActiveProcesses();
  const activeProcesses = data?.payload || [];
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Procesos Activos</h1>
      </div>
      <div className='w-full gap-2 flex flex-col'>
        {activeProcesses.map((process: any) => (
          <ProcessPill key={process.id} process={process} />
        ))}
      </div>
      {/* <div className="flex justify-center pt-2">
             <ModalForPreview title='Administrar Procesos'>
               <AdminPendingProcess />
             </ModalForPreview>
           </div> */}
    </div>
  );
}
