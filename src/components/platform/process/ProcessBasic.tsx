import React, { useMemo } from "react";
import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import ModalForPreview from "@/components/modals/ModalForPreview";
import Process from "../institution/Process";
import { formatDateToString, useCalcApprovalDate } from "@/hooks/useUtils";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import ProcessDetail from "./ProcessDetail";

export default function ProcessBasic(props: any) {
  const { process } = props;
  const { diasRestantesFormateados } = useCalcApprovalDate(process.start_date, process.approval_date);
  
  // Memoizar la fecha formateada para evitar recálculos innecesarios
  const formattedStartDate = useMemo(() => {
    return formatDateToString(process.start_date);
  }, [process.start_date]);

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
            <p className='text-center fontRoboto text-(--main-arci) align-middle pr-2'>{formattedStartDate}</p>
            <p className='fontRoboto text-center text-(--dark-gray)'>Plazo: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle'>{diasRestantesFormateados}</p>
          </div>
          <div className='flex flex-col md:flex-row justify-between gap-2 md:p-1'>
            {/* <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extención</button> */}
            <ModalForPreview title='Detalle del Proceso'>
              <Process id={props.process.id} />
            </ModalForPreview>
                        <ModalForPreview title='Preview del Proceso'>
              <ProcessDetail processData={{...process}} />
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
          {/* Solo renderizar profesionales si hay datos específicos del proceso */}
          {process.professionals && process.professionals.length > 0 ? (
            process.professionals.map((professional: any, index: number) => (
              <ProfesionalCard key={professional.id || index} userId={professional.id} />
            ))
          ) : (
            <div className="text-center text-gray-500 p-4">
              No hay candidatos asignados a este proceso
            </div>
          )}
        </Grid>
      </div>
      {props.process.type == "arcidrade" ? null : (
        <div className='candidatos-arci'>
          <p className='text-start fontRoboto text-(--main-arci) align-middle bg-gray-100'>Seleccionados ARCIDRADE</p>
          <Grid>
            {/* Solo renderizar profesionales de ARCIDRADE si hay datos específicos */}
            {process.arcidradeProfessionals && process.arcidradeProfessionals.length > 0 ? (
              process.arcidradeProfessionals.map((professional: any, index: number) => (
                <ProfesionalCard key={professional.id || index} userId={professional.id} />
              ))
            ) : (
              <div className="text-center text-gray-500 p-4">
                No hay candidatos ARCIDRADE asignados
              </div>
            )}
          </Grid>
        </div>
      )}
    </div>
  );
}