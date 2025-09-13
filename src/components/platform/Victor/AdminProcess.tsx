import React from "react";

import ProcessPill from "./pieces/adminProcess/ProcessPill";
import PendingProcess from "./pieces/adminProcess/PendingProcess";
import PendingProcessArci from "./pieces/adminProcess/PendingProcessArci";
import ActiveProcess from "./pieces/adminProcess/ActiveProcess";
import ArchivedProcess from "./pieces/adminProcess/ArchivedProcess";

export default function AdminProcess() {
  return (
    <div>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar Procesos</h2>
      <div className='grid grid-cols-1  md:grid-cols-4 gap-4 p-4 md:max-h-3/4 max-w-full justify-center'>
        <PendingProcess />
        <PendingProcessArci />
        <ActiveProcess />
        <ArchivedProcess />
      </div>
    </div>
  );
}
