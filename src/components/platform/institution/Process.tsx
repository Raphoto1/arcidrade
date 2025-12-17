import React, { useMemo } from "react";

import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import EmptyCard from "@/components/pieces/EmptyCard";
import ModalForPreviewBtnLong from "@/components/modals/ModalForPreviewBtnLong";
import SearchCandidates from "../pieces/SearchCandidates";
import { useProcess, useProfesionalsListedInProcess } from "@/hooks/useProcess";
import { useCalcApprovalDate, formatDateToString, useHandleStatusName, useHandleCategoryName } from "@/hooks/useUtils";
import ModalForForms from "@/components/modals/ModalForForms";
import UpdateProcessForm from "@/components/forms/platform/process/UpdateProcessForm";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import InstitutionGridSearch from "./InstitutionGridSearch";
import InstitutionGridSearchSelection from "./InstitutionGridSearchSelection";
import { useProfesional } from "@/hooks/usePlatPro";
import ConfirmFinishProcessForm from "@/components/forms/platform/process/ConfirmFinishProcessForm";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";

export default function Process(props: any) {
  const { data, error, isLoading, mutate } = useProcess(props.id);
  const { data: profesionalsSelected } = useProfesionalsListedInProcess(props.id);
  const processData = data?.payload;
  const profesionals = profesionalsSelected?.payload?.filter((profesional: any) => profesional.added_by === "institution") || [];
  const profesionalsArci = profesionalsSelected?.payload?.filter((profesional: any) => profesional.is_arcidrade) || [];
  const { diasRestantesFormateados } = useCalcApprovalDate(processData?.start_date, processData?.approval_date);

  // Memoizar el formateo de fecha para evitar recálculos
  const formattedStartDate = useMemo(() => {
    if (processData?.start_date) {
      return formatDateToString(processData.start_date);
    }
    return "";
  }, [processData?.start_date]);

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
              <p className='fontRoboto text-xl text-(--main-arci) capitalize'>{processData?.position}</p>
              <ModalForForms title='Editar'>
                <UpdateProcessForm id={processData?.id} />
              </ModalForForms>
            </div>

            <div className='flex w-full flex-col md:flex-row gap-2'>
              <div className='cube1 md:w-1/3 bg-white rounded-md px-1'>
                <p className='text-success text-end capitalize'>{processData?.status}</p>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-(--dark-gray)'>Categoria del Profesional:</h4>
                  <p className='text-md text-(--main-arci)'>{useHandleCategoryName(processData?.area) || "No especificada"}</p>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-(--dark-gray)'>Especialidad Principal:</h4>
                  <p className='text-md text-(--main-arci) text-end'>{processData?.main_speciality}</p>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-(--dark-gray)'>Especialidades Secundarias:</h4>
                  <div>
                    <p className='text-md text-(--main-arci) text-end'>
                      {processData?.extra_specialities?.length > 0
                        ? processData.extra_specialities.map((spec: any) => spec.speciality).join(", ")
                        : "No especificadas"}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-(--dark-gray)'>Status de estudios del profesional:</h4>
                  <p className='text-md text-(--main-arci) text-end'>{useHandleStatusName(processData?.profesional_status)}</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-(--dark-gray)'>Fecha de Inicio:</h4>
                  <p className='text-md text-(--main-arci)'>{formattedStartDate}</p>
                </div>
              </div>
              <div className='descrip md:w-2/3 bg-white rounded-md px-2'>
                <h2 className='fontRoboto text-xl text-(--main-arci)'>Descripción</h2>
                <p className='text-sm'>{processData?.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='Der flex md:w-1/3 flex-col p-2'>
          <div className='flex w-full justify-between'>
            <h4 className='fontRoboto text-sm text-(--dark-gray)'>Plazo: </h4>
            <p className='text-md text-(--main-arci)'>{diasRestantesFormateados}</p>
          </div>

          <div className='flex flex-col gap-2 h-auto'>
            {profesionals.length >= 3 || processData?.status === "completed" ? (
              <ModalForPreviewBtnLong title={processData?.status === "completed" ? "Proceso Completado" : "Se ha superado el limite de 3 candidatos"}>
                <div className='flex flex-col items-center'>
                  <p className='text-sm fontRoboto text-(--dark-gray)'>
                    {processData?.status === "completed" 
                      ? "El proceso ha sido completado. No es posible agregar más candidatos."
                      : "Se ha superado el limite de 3 candidatos, elimine por lo menos uno para poder Visualizar Nuevos Candidatos"
                    }
                  </p>
                </div>
              </ModalForPreviewBtnLong>
            ) : (
              <ModalForPreviewBtnLong title={"Buscar Candidatos"}>
                <InstitutionGridSearchSelection isFake={props.isFake} processId={processData?.id} processPosition={processData?.position} />
              </ModalForPreviewBtnLong>
            )}
            <ModalForFormsRedBtn title={"Eliminar Proceso"}>
              <ConfirmArchiveProcessForm id={processData?.id} />
            </ModalForFormsRedBtn>
            {processData?.status !== "completed" && processData?.status !== "pending" && (
              <ModalForFormsGreenBtn title={"Finalizar Proceso"}>
                <ConfirmFinishProcessForm id={processData.id} />
              </ModalForFormsGreenBtn>
            )}
            {/* <button className='btn bg-success h-auto text-sm'>Iniciar Proceso</button>
            <button className='btn bg-warning h-auto text-sm'>Pausar Proceso</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extension</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Finalizar Proceso</button> */}
          </div>
        </div>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-(--main-arci) text-center'>Seleccionados</h2>
        <Grid>
          {profesionals?.map((profesional: any) => (
            <ProfesionalCard
              key={profesional.id}
              userId={profesional.profesional_id}
              isFake={props.isFake}
              btnActive
              processId={processData.id}
              processPosition={processData.position}
              addedBy={"institution"}
              isSelected={profesional.process_status === "selected"}
            />
          ))}
          {profesionals.length >= 3 || processData?.status === "completed" ? null : (
            <ModalForPreviewBtnLong title={"Buscar Candidatos"}>
              <InstitutionGridSearchSelection isFake={props.isFake} processId={processData?.id} processPosition={processData?.position} />
            </ModalForPreviewBtnLong>
          )}
        </Grid>
      </div>
      {processData?.type == "arcidrade" ? (
        <div className='w-full pt-2'>
          <h2 className='text-xl font-bold text-(--main-arci) text-center'>Seleccionados Arcidrade</h2>
          <Grid>
            {/*logica procesos arcidrade*/}
            {profesionalsArci?.map((profesional: any) => (
              <ProfesionalCard
                key={profesional.id}
                userId={profesional.profesional_id}
                isFake={props.isFake}
                btnActive
                processId={processData.id}
                processPosition={processData.position}
                addedBy={"institution"}
              />
            ))}
          </Grid>
        </div>
      ) : null}
    </div>
  );
}
