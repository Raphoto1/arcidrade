import React from "react";

import ActiveInstitutions from "./pieces/adminInstitutions.tsx/ActiveInstitutions";
import PausedInstitutions from "./pieces/adminInstitutions.tsx/PausedInstitutions";

export default function AdminInstitutions() {
  return (
    <div>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar Instituciones</h2>
      <div className='grid grid-cols-1  md:grid-cols-2 gap-4 p-4 md:max-h-3/4 max-w-full justify-center'>
        <ActiveInstitutions />
        <PausedInstitutions />
      </div>
    </div>
  );
}
