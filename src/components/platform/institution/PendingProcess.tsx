import React from "react";
import { FiChevronDown } from "react-icons/fi";
import ProcessBasic from "../process/ProcessBasic";
import { usePendingProcesses } from "@/hooks/useProcess";

export default function PendingProcess() {
  const { data, error, isLoading } = usePendingProcesses();

  return (
    <div className='grid grid-cols-1 w-full p-4 md:max-h-3/4 md:max-w-3/4 md:justify-center md:align-middle md:items-center'>
      <div className="collapse collapse-arrow bg-gray-300 rounded-t-md mb-2">
        <input type="checkbox" className="peer" />
        <div className="collapse-title flex items-center justify-between">
          <h2 className='text-2xl fontArci text-center w-full'>Procesos Pendientes</h2>
          <FiChevronDown className="w-6 h-6 text-gray-700 ml-2" />
        </div>
        <div className="collapse-content">
          <div className="processss flex flex-col justify-center align-middle bg-gray-100 p-1 gap-2">
            {data && data.payload.length > 0 ? (
              data.payload.map((process: any, idx: number) => (
                <React.Fragment key={process.id}>
                  <ProcessBasic process={{ ...process }} />
                  {idx < data.payload.length - 1 && <hr className="border-t border-gray-300 my-1" />}
                </React.Fragment>
              ))
            ) : (
              <p className="text-center">No hay procesos pendientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
