import React, { useMemo } from "react";
import Grid from "../pieces/Grid";
import ProfesionalCard from "@/components/pieces/ProfesionalCard";
import ModalForPreview from "@/components/modals/ModalForPreview";
import Process from "../institution/Process";
import { formatDateToString, useCalcApprovalDate, useHandleCategoryName } from "@/hooks/useUtils";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import ProcessDetail from "./ProcessDetail";
import { useProfesionalsListedInProcess } from "@/hooks/useProcess";
import ModalForPreviewBtnLong from "@/components/modals/ModalForPreviewBtnLong";
import InstitutionGridSearchSelection from "../institution/InstitutionGridSearchSelection";
import ModalForForms from "@/components/modals/ModalForForms";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmFinishProcessForm from "@/components/forms/platform/process/ConfirmFinishProcessForm";
import ConfirmSelectProfesionalToProcessForm from "@/components/forms/platform/process/ConfirmSelectProfesionalToProcessForm";

export default function ProcessBasic(props: any) {
  const { process } = props;
  const { diasRestantesFormateados } = useCalcApprovalDate(process.start_date, process.approval_date);
  const { data: profesionalsSelected } = useProfesionalsListedInProcess(process.id);
  const profesionals = profesionalsSelected?.payload?.filter((profesional: any) => profesional.added_by === "institution") || [];
  const profesionalsArci = profesionalsSelected?.payload?.filter((profesional: any) => profesional.is_arcidrade) || [];
  const existingCandidateIds = profesionalsSelected?.payload?.map((profesional: any) => profesional.profesional_id) || [];
  // Memoizar la fecha formateada para evitar recálculos innecesarios
  const formattedStartDate = useMemo(() => {
    return formatDateToString(process.start_date);
  }, [process.start_date]);

  const formattedEndDate = useMemo(() => {
    return formatDateToString(process.end_date);
  }, [process.end_date]);

  return (
    <div className='flex flex-col justify-between align-middle bg-gray-100 items-center'>
      <div className='controls flex flex-col md:flex-row justify-between align-middle bg-gray-100 p-2 w-full'>
        <div className='flex flex-col justify-start align-middle bg-gray-100 items-center'>
          <div className="flex justify-center align-middle items-baseline gap-2">
            <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Cargo:</h2>
            <p className='text-center fontRoboto text-(--main-arci) align-middle capitalize'>{props.process.position}</p>
          </div>
          <div className="flex justify-center align-middle items-baseline gap-2">
            <h2 className='text-xl fontRoboto text-center text-(--dark-gray)'>Categoria del Profesional:</h2>
            <p className='text-center fontRoboto text-(--main-arci) align-middle capitalize'>{useHandleCategoryName(props.process.area) || "No especificada"}</p>
          </div>
        </div>
        <div className='botones'>
          <div className='flex flex-col md:flex-row justify-end align-middle bg-gray-100 pr-2'>
            <p className='fontRoboto text-center text-(--dark-gray)'>Fecha Inicio de Proceso: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle pr-2'>{formattedStartDate}</p>
            {props.process.end_date && (
              <>
                <p className='fontRoboto text-center text-(--dark-gray)'>Fecha Fin de Proceso: </p>
                <p className='text-center fontRoboto text-(--main-arci) align-middle pr-2'>{formattedEndDate}</p>
              </>
            )}
            <p className='fontRoboto text-center text-(--dark-gray)'>Plazo: </p>
            <p className='text-center fontRoboto text-(--main-arci) align-middle'>{diasRestantesFormateados}</p>
          </div>
          <div className='flex flex-col md:flex-row justify-end gap-2 md:p-1'>
            {/* <button className='btn bg-[var(--main-arci)] text-white text-sm h-auto'>Solicitar Extención</button> */}
            <ModalForPreview title='Detalle del Proceso'>
              <Process id={props.process.id} isFake={props.isFake} />
            </ModalForPreview>
            <ModalForPreview title='Preview del Proceso'>
              <ProcessDetail processData={{ ...process }} />
            </ModalForPreview>
            {/* <button className='btn bg-amber-300 text-white text-sm h-auto'>Pausar Proceso</button> */}
            <ModalForFormsRedBtn title='Eliminar Proceso'>
              <ConfirmArchiveProcessForm id={process.id} />
            </ModalForFormsRedBtn>
            {process.status !== "completed" && process.status !== "pending" && process.status !== "paused" && (
              <ModalForFormsGreenBtn title={"Finalizar Proceso"}>
                <ConfirmFinishProcessForm id={process.id} />
              </ModalForFormsGreenBtn>
            )}
          </div>
        </div>
      </div>
      <div className='candidato min-w-full'>
        <p className='text-start fontRoboto text-(--main-arci) align-middle bg-gray-100'>Mis Seleccionados</p>
        <Grid>
          {profesionals?.map((profesional: any) => (
            <div key={profesional.id}>
              {process.status !== "pending" && process.status !== "paused" && profesional.process_status !== "selected" && (
              <ModalForFormsGreenBtn title={"Seleccionar para Contratación"}>
                <ConfirmSelectProfesionalToProcessForm UserID={profesional.profesional_id} ProcessId={process.id} fullName={profesional.fullName} processPosition={process.position} addedBy={"institution"}  />
              </ModalForFormsGreenBtn>
              )}
              <ProfesionalCard
                userId={profesional.profesional_id}
                isFake={props.isFake}
                isSelected={profesional.process_status === "selected"}
                btnActive
                hideAddCandidate
                processId={process.id}
                processPosition={process.position}
                addedBy={"institution"}
              />
            </div>
          ))}
          {profesionals.length >= 3 || process.status === "completed" ? null : (
            <ModalForPreviewBtnLong title={"Buscar Candidatos"}>
              <InstitutionGridSearchSelection
                isFake={props.isFake}
                processId={process?.id}
                processPosition={process?.position}
                lockedSubArea={process?.area}
                existingCandidateIds={existingCandidateIds}
              />
            </ModalForPreviewBtnLong>
          )}
        </Grid>
      </div>
      {process.type === "arcidrade" ? (
        <div className='candidatos-arci'>
          <p className='text-start fontRoboto text-(--main-arci) align-middle bg-gray-100'>Seleccionados ARCIDRADE</p>
          <Grid>
            {/* Solo renderizar profesionales de ARCIDRADE si hay datos específicos */}
            {profesionalsArci?.map((profesional: any) => (
              <ProfesionalCard
                key={profesional.id}
                userId={profesional.profesional_id}
                isFake={props.isFake}
                processId={process.id}
                processPosition={process.position}
                addedBy={"institution"}
              />
            ))}
          </Grid>
        </div>
      ) : null}
    </div>
  );
}
