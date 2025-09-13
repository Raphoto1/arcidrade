import React from "react";

import ProcessPill from "./ProcessPill";

export default function ActiveProcess() {
  return (
    <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-sm p-2 md:justify-center md:gap-4 md:h-auto'>
      <div className='pb-2'>
        <h1 className='text-2xl fontArci text-center'>Procesos Activos</h1>
      </div>
      <div>
        <ProcessPill />
      </div>
    </div>
  );
}
