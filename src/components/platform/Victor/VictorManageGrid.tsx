import React from "react";

import ProcesAvailableInstitution from "./ProcesAvailableInstitution";
import ProcessAvailableProfesional from "./ProcesAvailableProfesional";
import GenerateInvitations from "./GenerateInvitations";

export default function VictorManageGrid() {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-1  md:grid-cols-3 gap-4 p-4 md:max-h-3/4 max-w-full justify-center'>
        <ProcesAvailableInstitution />
        <ProcessAvailableProfesional />
        <GenerateInvitations />
      </div>
    </div>
  );
}
