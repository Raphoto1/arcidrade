import React from "react";
import { FiChevronDown } from "react-icons/fi";
import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import ModalForPreview from "@/components/modals/ModalForPreview";
import OfferDetail from "@/components/pieces/OfferDetail";
import Process from "./Process";
import ModalForForms from "@/components/modals/ModalForForms";
import CreateProcessForm from "@/components/forms/platform/process/CreateProcessForm";
import ProcessBasic from "../process/ProcessBasic";
import { useActiveProcesses, useProcesses } from "@/hooks/useProcess";

export default function ActiveProcess() {
  const {data, error, isLoading} = useActiveProcesses();

  return (
    <div className='grid grid-cols-1 w-full md:w-3/4 p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
      <div className='grid md:flex justify-center align-middle pb-2'>
        <ModalForForms title={'Crear Proceso'}>
          <CreateProcessForm />
        </ModalForForms>
      </div>
      <div className="collapse collapse-arrow bg-gray-300 rounded-t-md mb-2">
        <input type="checkbox" className="peer" />
        <div className="collapse-title flex items-center justify-between">
          <h2 className='text-2xl fontArci text-center w-full'>Procesos activos</h2>
          <FiChevronDown className="w-6 h-6 text-gray-700 ml-2" />
        </div>
        <div className="collapse-content">
          <div className="processss flex flex-col justify-center align-middle bg-gray-100 p-1 gap-2">
            {data && data.payload.length > 0 ? (
              data.payload.map((process: any, idx: number) => (
                <React.Fragment key={process.id}>
                  <ProcessBasic process={{...process}} />
                  {idx < data.payload.length - 1 && <hr className="border-t border-gray-300 my-1" />}
                </React.Fragment>
              ))
            ) : (
              <p className="text-center">No hay procesos activos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
