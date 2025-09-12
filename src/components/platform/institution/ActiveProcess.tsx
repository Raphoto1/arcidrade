import React from "react";

import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import ModalForPreview from "@/components/modals/ModalForPreview";
import OfferDetail from "@/components/pieces/OfferDetail";
import Process from "./Process";
export default function ActiveProcess() {
  return (
    <div className='grid grid-cols-1 w- p-4 md:max-h-3/4 md:max-w-full md:justify-center md:align-middle md:items-center'>
      <div className='grid justify-center align-middle pb-2'>
        <ModalForPreview title={'Crear Proceso Muestra Preview'}>
          <Process />
        </ModalForPreview>
      </div>
      <div className='flex justify-center align-middle bg-gray-300 rounded-t-md'>
        <h2 className='text-2xl fontArci text-center'>Procesos activos</h2>
      </div>
      <div className='flex justify-between align-middle bg-gray-100 items-center'>
        <div className='flex justify-start align-middle bg-gray-100 items-center'>
          <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Cargo:</h2>
          <p className='text-center fontRoboto text-(--main-arci) align-middle'>Cirujano</p>
        </div>
        <div className='botones'>
          <div className='flex justify-end align-middle bg-gray-100 pr-2'>
            <p className='fontRoboto text-center text-(--dark-gray)'>Plazo: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle'>35 dias</p>
          </div>
          <div className='flex-wrap justify-between gap-2 md:p-2'>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extención</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Ver Proceso</button>
            <button className='btn bg-amber-300 text-white text-sm h-auto'>Pausar Proceso</button>
            <button className='btn bg-[var(--orange-arci)] text-white text-sm h-auto'>Eliminar Proceso</button>
          </div>
        </div>
      </div>
      <Grid>
        <ProfesionalCard />
        <ProfesionalCard />
        <ProfesionalCard />
      </Grid>
      <p className='text-start fontRoboto text-(--main-arci) align-middle bg-gray-100'>Seleccionados ARCIDRADE</p>
      <Grid>
        <ProfesionalCard />
        <ProfesionalCard />
        <ProfesionalCard />
      </Grid>
    </div>
  );
}
