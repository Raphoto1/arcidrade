import React from "react";

import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard"

export default function PendingProcess() {
  return (
    <div className='grid grid-cols-1 w- p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
        <div className="flex justify-center align-middle bg-gray-300 rounded-t-md">
          <h2 className='text-2xl fontArci text-center'>Procesos Pendientes</h2>
        </div>
      <div className="flex justify-between align-middle bg-gray-100 items-center">
        <div className="flex justify-start align-middle bg-gray-100 items-center">
          <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Cargo:</h2>
          <p className="text-center fontRoboto text-(--main-arci) align-middle">Cirujano</p>
        </div>
        <div className="botones">
          <div className="flex-wrap justify-between gap-2 md:p-2">
            <button className="btn bg-[var(--main-arci)] text-white text-sm h-auto">Iniciar Proceso</button>

            <button className="btn bg-[var(--orange-arci)] text-white text-sm h-auto">Eliminar Proceso</button>
          </div>
        </div>
      </div>
          <Grid >
        <ProfesionalCard />
        <ProfesionalCard />
        <ProfesionalCard />
      </Grid>
    </div>
  );
}
