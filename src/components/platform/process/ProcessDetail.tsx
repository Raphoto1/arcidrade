import { formatDateToString, useHandleCategoryName, useHandleStatusName } from "@/hooks/useUtils";
import React, { useMemo } from "react";

import ModalForForms from "@/components/modals/ModalForForms";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmAddProfesionalToProcessForm from "@/components/forms/platform/process/ConfirmAddProfesionalToProcessForm";
import ConfirmDeleteProfesionalToProcessForm from "@/components/forms/platform/process/ConfirmDeleteProfesionalToProcessForm";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

export default function ProcessDetail(props: any) {
  const { processData } = props;
  // Memoizar el formateo de fecha para evitar recálculos
  const formattedStartDate = useMemo(() => {
    if (processData?.start_date) {
      return formatDateToString(processData.start_date);
    }
    return "";
  }, [processData?.start_date]);
  return (
    <div className='flex justify-center'>
      <div className='IZq flex md:w-2/3 w-full bg-gray-200 rounded-sm z-10'>
        <div className='topHat p-2 rounded-sm z-10 w-full pb-2'>
          <div className='flex justify-between pb-2'>
            <h1 className='text-2xl fontArci'>Detalle de Proceso:</h1>
            <p className='fontRoboto text-xl text-(--main-arci) capitalize'>{processData?.position}</p>
          </div>

          <div className='flex w-full flex-col md:flex-row gap-2'>
            <div className='cube1 md:w-1/3 bg-white rounded-md px-1'>
               <div className='flex justify-between border-b-2'>
                <h4 className='fontRoboto text-sm text-(--dark-gray)'>Categoria del Profesional:</h4>
                <p className='text-md text-(--main-arci) text-end'>{useHandleCategoryName(processData?.area) || "No especificada"}</p>
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
                <p className='text-md text-(--main-arci) text-end'>{formattedStartDate}</p>
              </div>
            </div>
            <div className='descrip md:w-2/3 bg-white rounded-md px-2'>
              <h2 className='fontRoboto text-xl text-(--main-arci)'>Descripción</h2>
              <RichTextDisplay content={processData?.description} className='text-sm' />
            </div>
          </div>
          <div className='controles w-full flex justify-end mt-4'>
            {props.btnActive ? (
              <div className='buttons w-40 h-15 ml-2 grid flex-col content-between'>
                <ModalForForms title='Agregar Candidato'>
                  <ConfirmAddProfesionalToProcessForm
                    UserID={props.profesionalId}
                    ProcessId={processData.id}
                    fullName={props.fullName || "Postulación"}
                    processPosition={processData.position}
                    addedBy={props.addedBy || "profesional"}
                  />
                </ModalForForms>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
