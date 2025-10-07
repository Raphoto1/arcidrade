import React from "react";

import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import EmptyCard from "@/components/pieces/EmptyCard";
import ModalForPreviewBtnLong from "@/components/modals/ModalForPreviewBtnLong";
import SearchCandidates from "../pieces/SearchCandidates";
import { useProcess } from "@/hooks/useProcess";
import { useCalcApprovalDate, useFormatDateToString, useHandleStatusName } from "@/hooks/useUtils";
import ModalForForms from "@/components/modals/ModalForForms";
import UpdateProcessForm from "@/components/forms/platform/process/UpdateProcessForm";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";

export default function Process(props: any) {
  const { data, error, isLoading, mutate } = useProcess(props.id);
  console.log(data);
  const processData = data?.payload;
  const { diasRestantesFormateados } = useCalcApprovalDate(processData?.start_date, processData?.approval_date);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading process data</div>;
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row w-full pt-2'>
        <div className='IZq flex md:w-2/3 w-full bg-gray-200 rounded-sm z-10'>
          <div className='topHat p-2 rounded-sm z-10 w-full pb-2'>
            <div className='flex justify-between pb-2'>
              <h1 className='text-2xl fontArci'>Detalle de Proceso:</h1>
              <p className='fontRoboto text-xl text-[var(--main-arci)] capitalize'>{processData?.position}</p>
              <ModalForForms title='Editar'>
                <UpdateProcessForm id={processData?.id} />
              </ModalForForms>
            </div>

            <div className='flex w-full flex-col md:flex-row gap-2'>
              <div className='cube1 md:w-1/3 bg-white rounded-md px-1'>
                <p className='text-success text-end capitalize'>{processData?.status}</p>
                {/* <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Area:</h4>
                  <p className='text-md text-[var(--main-arci)]'>Medico</p>
                </div> */}
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidad Principal:</h4>
                  <p className='text-md text-[var(--main-arci)]'>{processData?.main_speciality}</p>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidades Secundarias:</h4>
                  <div>
                    <p className='text-md text-[var(--main-arci)] text-end'>{processData?.extra_specialities.map((spec: any) => spec.speciality).join(", ")}</p>
                  </div>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Status de estudios del profesional:</h4>
                  <p className='text-md text-[var(--main-arci)] text-end'>{useHandleStatusName(processData?.profesional_status)}</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Fecha de Inicio:</h4>
                  <p className='text-md text-[var(--main-arci)]'>{useFormatDateToString(processData?.start_date)}</p>
                </div>
              </div>
              <div className='descrip md:w-2/3 bg-white rounded-md px-2'>
                <h2 className='fontRoboto text-xl text-[var(--main-arci)]'>Descripción</h2>
                <p className='text-sm'>{processData?.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='Der flex md:w-1/3 flex-col p-2'>
          <div className='flex w-full justify-between'>
            <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Plazo: </h4>
            <p className='text-md text-[var(--main-arci)]'>{diasRestantesFormateados}</p>
          </div>

          <div className='flex flex-col gap-2 h-auto'>
            <ModalForPreviewBtnLong title={"Buscar Candidatos Muestra Preview"}>
              <SearchCandidates />
            </ModalForPreviewBtnLong>
            <ModalForFormsRedBtn title={"Eliminar Proceso"} >
              <ConfirmArchiveProcessForm id={processData?.id} />
            </ModalForFormsRedBtn>
            <button className='btn bg-success h-auto text-sm'>Iniciar Proceso</button>
            <button className='btn bg-warning h-auto text-sm'>Pausar Proceso</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extension</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Finalizar Proceso</button>
          </div>
        </div>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-[var(--main-arci)] text-center'>Seleccionados</h2>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <EmptyCard />
        </Grid>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-[var(--main-arci)] text-center'>Seleccionados Arcidrade</h2>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <EmptyCard />
        </Grid>
      </div>
    </div>
  );
}
