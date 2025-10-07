import React from "react";
import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import ModalForPreview from "@/components/modals/ModalForPreview";
import Process from "../institution/Process";
import { useFormatDateToString, useCalcApprovalDate } from "@/hooks/useUtils";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";

export default function ProcessBasic(props: any) {
  const { process } = props;
  const { diasRestantesFormateados } = useCalcApprovalDate(process.start_date, process.approval_date);

  return (
    <div className='flex flex-col justify-between align-middle bg-gray-100 items-center'>
      <div className='controls flex flex-col md:flex-row justify-between align-middle bg-gray-100 p-2 w-full'>
        <div className='flex justify-start align-middle bg-gray-100 items-center'>
          <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Cargo:</h2>
          <p className='text-center fontRoboto text-(--main-arci) align-middle capitalize'>{props.process.position}</p>
        </div>
        <div className='botones'>
          <div className='flex flex-col md:flex-row justify-end align-middle bg-gray-100 pr-2'>
            <p className='fontRoboto text-center text-(--dark-gray)'>Fecha Inicio de Proceso: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle pr-2'>{useFormatDateToString(props.process.start_date)}</p>
            <p className='fontRoboto text-center text-(--dark-gray)'>Plazo: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle'>{diasRestantesFormateados}</p>
          </div>
          <div className='flex flex-col md:flex-row justify-between gap-2 md:p-2'>
            {/* <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extención</button> */}
            <ModalForPreview title='Detalle del Proceso'>
              <Process id={props.process.id} />
            </ModalForPreview>
            {/* <button className='btn bg-amber-300 text-white text-sm h-auto'>Pausar Proceso</button> */}
            <ModalForFormsRedBtn title='Eliminar Proceso'>
              <ConfirmArchiveProcessForm id={process.id} />
            </ModalForFormsRedBtn>
          </div>
        </div>
      </div>
      <div className='candidatos'>
        <Grid>
          <ProfesionalCard />
          <ProfesionalCard />
          <ProfesionalCard />
        </Grid>
      </div>
      {props.process.type == "arcidrade" ? null : (
        <div className='candidatos-arci'>
          <p className='text-start fontRoboto text-(--main-arci) align-middle bg-gray-100'>Seleccionados ARCIDRADE</p>
          <Grid>
            <ProfesionalCard />
            <ProfesionalCard />
            <ProfesionalCard />
          </Grid>
        </div>
      )}
    </div>
  );
}
