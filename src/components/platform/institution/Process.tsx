import React from "react";

import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import EmptyCard from "@/components/pieces/EmptyCard";
import ModalForPreviewBtnLong from "@/components/modals/ModalForPreviewBtnLong";
import SearchCandidates from "../pieces/SearchCandidates";

export default function Process() {
  return (
    <div>
      <div className='flex flex-col md:flex-row w-full pt-2'>
        <div className='IZq flex md:w-2/3 w-full bg-gray-200 rounded-sm z-10'>
          <div className='topHat p-2 rounded-sm z-10 w-full pb-2'>
            <div className='flex justify-between pb-2'>
              <h1 className='text-2xl fontArci'>Detalle de Proceso:</h1>
              <p className='fontRoboto text-xl text-[var(--main-arci)]'>Cirujano jefe</p>
              <button className='btn bg-[var(--main-arci)] text-white justify-end'>Editar</button>
            </div>

            <div className='flex w-full flex-col md:flex-row gap-2'>
              <div className='cube1 md:w-1/3 bg-white rounded-md px-1'>
                <p className='text-success text-end'>Activo</p>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Area:</h4>
                  <p className='text-md text-[var(--main-arci)]'>Medico</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidad Principal:</h4>
                  <p className='text-md text-[var(--main-arci)]'>Cirujano</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidades Secundarias:</h4>
                  <div>
                    <p className='text-md text-[var(--main-arci)]'>Pediatra</p>
                    <p className='text-md text-[var(--main-arci)]'>Oncologo</p>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Status:</h4>
                  <p className='text-md text-[var(--main-arci)]'>Graduado</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Fecha de Inicio:</h4>
                  <p className='text-md text-[var(--main-arci)]'>25/10/2025</p>
                </div>
              </div>
              <div className='descrip md:w-2/3 bg-white rounded-md px-2'>
                <h2 className='fontRoboto text-xl text-[var(--main-arci)]'>Descripción</h2>
                <p className='text-sm'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum architecto labore atque non amet, dignissimos, voluptates porro, optio neque
                  modi commodi. Quibusdam quae consectetur corporis, repellat accusantium quis odio aliquam cumque atque doloremque placeat quidem harum quia,
                  enim vel? Reprehenderit tempore suscipit omnis assumenda dolor quis error nihil. Maiores dolorum voluptatem similique tempore perspiciatis est
                  voluptatum quasi illum doloremque a aliquam, quaerat illo dolores maxime nihil iste placeat consequuntur quibusdam impedit corrupti laudantium
                  molestias assumenda veniam aperiam. Eligendi voluptates deleniti quis doloribus maxime, consequatur recusandae iure exercitationem veniam
                  soluta laboriosam rem nisi qui esse. Eaque, consequuntur! Enim alias quisquam quo corrupti soluta. Nemo ea veniam explicabo vero, eligendi
                  libero doloremque aspernatur saepe incidunt ullam, quaerat similique animi tenetur cum! Labore animi quasi reprehenderit cupiditate adipisci!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='Der flex md:w-1/3 flex-col p-2'>
          <div className='flex w-full justify-between'>
            <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Plazo: </h4>
            <p className='text-md text-[var(--main-arci)]'>38 dias para cerrar el Proceso</p>
          </div>

          <div className='flex flex-col gap-2 h-auto'>
                    <ModalForPreviewBtnLong title={'Buscar Candidatos'}>
                      <SearchCandidates />
                    </ModalForPreviewBtnLong>
            <button className='btn bg-[var(--orange-arci)] text-sm h-auto'>Archivar Procesos</button>
            <button className='btn bg-success h-auto text-sm'>Iniciar Proceso</button>
            <button className='btn bg-warning h-auto text-sm'>Pausar Proceso</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extension</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Finalizar Proceso</button>
          </div>
        </div>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-[var(--main-arci)]'>Seleccionados</h2>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <EmptyCard />
        </Grid>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-[var(--main-arci)]'>Seleccionados Arcidrade</h2>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <EmptyCard />
        </Grid>
      </div>
    </div>
  );
}
