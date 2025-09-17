import React from "react";

import Grid from "@/components/platform/pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";

export default function AdminPendingProcess() {
  return (
    <div>
      <h2 className='font-bold font-oswald text-xl text-center'>Administrar procesos pendientes</h2>
      <div>
        <div className='flex-col justify-start bg-gray-200 w-full align-middle items-center rounded-t-sm p-2 md:justify-center md:gap-4 md:h-auto'>
          <div className='pb-2'>
            <h1 className='text-2xl fontArci text-center'>Procesos Pendientes</h1>
          </div>
          <div className='bg-gray-100 grid md:flex md:justify-around md:w-ful items-center align-middle'>
            <div className='flex items-center'>
              <h3 className='text-sm text-gray-600'>Cargo:</h3>
              <p className='font-light text-[var(--main-arci)]'>Cirujano</p>
            </div>
            <div className='flex items-center'>
              <h3 className='text-sm text-gray-600'>Cliente:</h3>
              <p className='font-light text-[var(--main-arci)]'>Clinica Toledo</p>
            </div>
            <div className='md:w-1/3 p-1 flex flex-col md:flex-row justify-center'>
              <button className='btn bg-[var(--main-arci)] w-full md:w-auto text-white h-auto '>Detalle</button>
              <button className='btn bg-[var(--orange-arci)] w-full md:w-auto text-white h-auto '>Pausar</button>
              <button className='btn bg-warning w-full text-white h-auto md:w-auto'>Solicitud de Contacto</button>
              <button className='btn bg-[var(--main-arci)] w-full text-white h-auto md:w-auto'>Revisar Solicitudes</button>
              <button className='btn bg-[var(--main-arci)] w-full text-white h-auto md:w-auto'>Revisar Procesos</button>
            </div>
          </div>
          <div className='flex-col justify-start bg-white w-full align-middle items-center rounded-t-sm p-2 md:justify-center md:gap-4 md:h-auto'>
            <div className='flex-col justify-start bg-[var(--orange-arci)] w-full align-middle items-center rounded-t-sm p-2 md:justify-center md:gap-4 md:h-auto'>
              <p className='font-light text-white'>Cirujano</p>
              <p className='font-light text-white'>Residente</p>
              <p className='font-light text-white'>España - Sada</p>
            </div>
            <div>
              <h2 className='font-Oswald font-bold text-[var(--main-arci)]'>Clinica toledo</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus rerum magni consequuntur eos optio tenetur possimus. Aspernatur, dolore
                provident maxime ab veniam ullam iusto quisquam.
              </p>
              <div className="flex md:justify-end">
                <button className='btn bg-[var(--main-arci)] w-full text-white h-auto md:w-auto '>Editar Proceso</button>
              </div>
            </div>
          </div>
          <div>
            <h2 className='font-Oswald font-bold text-[var(--main-arci)]'>Seleccionados Institución</h2>
            <Grid>
              <ProfesionalCard />
            </Grid>
                  </div>
                  <div>
            <h2 className='font-Oswald font-bold text-[var(--main-arci)]'>Seleccionados Arcidrade</h2>
            <Grid>
              <ProfesionalCard />
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
