import React, { useMemo } from "react";
//imports Propios
import Grid from "../../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import EmptyCard from "@/components/pieces/EmptyCard";
import ModalForPreviewBtnLong from "@/components/modals/ModalForPreviewBtnLong";
import SearchCandidates from "../../pieces/SearchCandidates";
import { useProcess, useProfesionalsListedInProcess } from "@/hooks/useProcess";
import { useCalcApprovalDate, formatDateToString, useHandleStatusName } from "@/hooks/useUtils";
import ModalForForms from "@/components/modals/ModalForForms";
import UpdateProcessForm from "@/components/forms/platform/process/UpdateProcessForm";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import InstitutionGridSearch from "../../institution/InstitutionGridSearch";
import InstitutionGridSearchSelection from "../../institution/InstitutionGridSearchSelection";
import { useProfesional } from "@/hooks/usePlatPro";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmActivateProcessForm from "@/components/forms/platform/process/ConfirmActivateProcessForm";
import ModalForPreviewTextLink from "@/components/modals/ModalForPreviewTextLink";
import UserDescription from "../../pieces/UserDescription";
import { useInstitutionById } from "@/hooks/usePlatInst";
import ModalForFormsYellowBtn from "@/components/modals/ModalForFormsYellowBtn";
import ConfirmPauseProcessForm from "@/components/forms/platform/process/ConfirmPauseProcessForm";

export default function ProcessVictor(props: any) {
  const { data, error, isLoading, mutate } = useProcess(props.id);
  const { data: profesionalsSelected } = useProfesionalsListedInProcess(props.id);
  const processData = data?.payload;

  // Verificar que processData existe antes de usar sus propiedades
  const { data: institutionPack } = useInstitutionById(processData?.user_id || "");
  const institutionData = institutionPack?.payload;

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
    return (
      <div className='flex justify-center items-center p-4'>
        <div className='loading loading-spinner loading-lg'></div>
        <span className='ml-2'>Cargando proceso...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='alert alert-error max-w-md mx-auto'>
        <p>Error al cargar los datos del proceso</p>
      </div>
    );
  }

  // Verificar que tenemos datos válidos del proceso
  if (!processData) {
    return (
      <div className='alert alert-warning max-w-md mx-auto'>
        <p>No se encontraron datos del proceso</p>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row w-full pt-2'>
        <div className='IZq flex md:w-2/3 w-full bg-gray-200 rounded-sm z-10'>
          <div className='topHat p-2 rounded-sm z-10 w-full pb-2'>
            <div className='flex align-middle items-center gap-2 pb-2'>
              <h1 className='text-accent'>Cliente:</h1>
              <p className='text-xl text-[var(--main-arci)]'>{institutionData?.name}</p>
            </div>
            <div className='flex justify-between pb-2'>
              <h1 className='text-2xl fontArci'>Detalle de Proceso:</h1>
              <p className='fontRoboto text-xl text-[var(--main-arci)] capitalize'>{processData?.position}</p>
              <ModalForForms title='Editar'>
                <UpdateProcessForm id={processData?.id} />
              </ModalForForms>
            </div>

            <div className='flex w-full flex-col md:flex-row gap-2'>
              <div className='cube1 md:w-1/ bg-white rounded-md px-1'>
                <p className='text-success text-end capitalize'>{processData?.status}</p>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidad Principal:</h4>
                  <p className='text-md text-[var(--main-arci)] text-end'>{processData?.main_speciality}</p>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Especialidades Secundarias:</h4>
                  <div>
                    <p className='text-md text-[var(--main-arci)] text-end'>
                      {processData?.extra_specialities?.length > 0
                        ? processData.extra_specialities.map((spec: any) => spec.speciality).join(", ")
                        : "No especificadas"}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between border-b-2'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Status de estudios del profesional:</h4>
                  <p className='text-md text-[var(--main-arci)] text-end'>{useHandleStatusName(processData?.profesional_status)}</p>
                </div>
                <div className='flex justify-between'>
                  <h4 className='fontRoboto text-sm text-[var(--dark-gray)]'>Fecha de Inicio:</h4>
                  <p className='text-md text-[var(--main-arci)]'>{formattedStartDate}</p>
                </div>
              </div>
              <div className='descrip md:w-2/3 bg-white rounded-md px-2'>
                <h2 className='fontRoboto text-xl text-[var(--main-arci)]'>Descripción</h2>
                <p className='text-sm'>{processData?.description}</p>
                <ModalForPreviewTextLink title='ver mas...'>
                  <UserDescription description={processData?.description} />
                </ModalForPreviewTextLink>
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
            {profesionals.length >= 3 ? (
              <ModalForPreviewBtnLong title={"Se ha superado el limite de 3 candidatos"}>
                <div className='flex flex-col items-center'>
                  <p className='text-sm fontRoboto text-[var(--dark-gray)]'>
                    Se ha superado el limite de 3 candidatos, elimine por lo menos uno para poder Visualizar Nuevos Candidatos
                  </p>
                </div>
              </ModalForPreviewBtnLong>
            ) : (
              <ModalForPreviewBtnLong title={"Buscar Candidatos"}>
                <InstitutionGridSearchSelection
                  isFake={props.isFake}
                  processId={processData?.id}
                  processPosition={processData?.position}
                  addedBy='arcidrade'
                  isArci={true}
                />
              </ModalForPreviewBtnLong>
            )}
            <ModalForFormsRedBtn title={"Eliminar Proceso"}>
              <ConfirmArchiveProcessForm id={processData?.id} />
            </ModalForFormsRedBtn>
            {processData?.status == "pending" && (
              <ModalForFormsGreenBtn title={"Aceptar Proceso"}>
                <ConfirmActivateProcessForm id={processData?.id} />
              </ModalForFormsGreenBtn>
            )}
            {processData?.status == "active" && (
              <ModalForFormsYellowBtn title={"Pausar Proceso"}>
                <ConfirmPauseProcessForm id={processData?.id} />
              </ModalForFormsYellowBtn>
            )}
            {/* <button className='btn bg-success h-auto text-sm'>Iniciar Proceso</button>
            <button className='btn bg-warning h-auto text-sm'>Pausar Proceso</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extension</button>
            <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Finalizar Proceso</button> */}
          </div>
        </div>
      </div>
      <div className='w-full pt-2'>
        <h2 className='text-xl font-bold text-[var(--main-arci)] text-center mb-4'>Seleccionados</h2>
        <div className={`w-full bg-gray-100 rounded-lg p-4 ${profesionals?.length > 0 ? "min-h-[200px]" : "h-auto"}`}>
          {profesionals?.length > 0 ? (
            <Grid>
              {profesionals?.map((profesional: any) => (
                <ProfesionalCard
                  key={profesional.id}
                  userId={profesional.profesional_id}
                  isFake={props.isFake}
                  btnActive
                  processId={processData.id}
                  processPosition={processData.position}
                  isArci={false}
                  addedBy={"arcidrade"}
                />
              ))}
              {profesionals.length >= 3 ? null : (
                <ModalForPreviewBtnLong title={"Buscar Candidatos"}>
                  <InstitutionGridSearchSelection isFake={props.isFake} processId={processData?.id} processPosition={processData?.position} />
                </ModalForPreviewBtnLong>
              )}
            </Grid>
          ) : (
            <div className='flex items-center justify-center'>
              <div className='text-center'>
                <p className='text-gray-500 text-base'>No hay profesionales seleccionados</p>
                <p className='text-gray-400 text-sm mt-1'>Usa "Buscar Candidatos" para agregar profesionales</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {processData?.type == "arcidrade" ? (
        <div className='w-full pt-2'>
          <h2 className='text-xl font-bold text-[var(--main-arci)] text-center mb-4'>Seleccionados Arcidrade</h2>
          <div className={`w-full bg-gray-100 rounded-lg p-4 ${profesionalsArci?.length > 0 ? "min-h-[200px]" : "h-auto"}`}>
            {profesionalsArci?.length > 0 ? (
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
                    addedBy={"arcidrade"}
                    isArci={true}
                  />
                ))}
              </Grid>
            ) : (
              <div className='flex items-center justify-center'>
                <div className='text-center'>
                  <p className='text-gray-500 text-base'>No hay profesionales de Arcidrade seleccionados</p>
                  <p className='text-gray-400 text-sm mt-1'>Los profesionales de Arcidrade aparecerán aquí cuando sean agregados</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
