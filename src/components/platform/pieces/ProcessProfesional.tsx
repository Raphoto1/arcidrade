"use client";
import ModalForPreview from "@/components/modals/ModalForPreview";
import { useInstitutionById } from "@/hooks/usePlatInst";
import { useProfesionalById } from "@/hooks/usePlatPro";
import { useProcess } from "@/hooks/useProcess";
import { formatDateToString, useFullName } from "@/hooks/useUtils";
import React from "react";

import { FaStar } from "react-icons/fa";
import ProfesionalDetailFull from "./ProfesionalDetailFull";
import ProfesionalDetailFullById from "./ProfesionalDetailFullById";
import ProcessDetail from "../process/ProcessDetail";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmAddProfesionalToProcessVictorForm from "@/components/forms/platform/process/ConfirmAddProfesionalToProcessVictorForm";
import ConfirmDeleteProfesionalToProcessVictorForm from "@/components/forms/platform/process/ConfirmDeleteProfesionalToProcessVictorForm";

export default function ProcessProfesional(props: any) {
  const processData = props.processData;
  const userId = props.userId;
  const { data: processPack } = useProcess(processData);
  const { data: profesionalPack } = useProfesionalById(userId);
  const { data: institutionPack } = useInstitutionById(processPack?.payload.user_id);




  const fullName = useFullName(profesionalPack?.payload.profesional_data?.name, profesionalPack?.payload.profesional_data?.last_name);
  return (
    <div>
      <div className=' bg-gray-50 w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <h2 className='text-(--main-arci) text-bold text-wrap font-bold'>{fullName}</h2>
          <p className='text-sm text-(--orange-arci) text-wrap w-full'>{institutionPack?.payload.name}</p>
          <span className='text-sm text-gray-600 w-100'>{processPack?.payload.position}</span>
          <p className='font-light'>{formatDateToString(processPack?.payload.created_at)}</p>
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <ModalForPreview title='Ver Profesional'>
            <ProfesionalDetailFullById userId={userId} />
          </ModalForPreview>
          <ModalForPreview title='Ver Proceso'>
            <ProcessDetail processData={processPack?.payload} />
          </ModalForPreview>
          <ModalForFormsRedBtn title='Rechazar Solicitud'>
            <ConfirmDeleteProfesionalToProcessVictorForm ProcessId={processPack?.payload.id} UserID={userId} fullName={fullName} processPosition={processPack?.payload.position} />
          </ModalForFormsRedBtn>
          <ModalForFormsGreenBtn title='Aceptar Solicitud'>
            <ConfirmAddProfesionalToProcessVictorForm
              ProcessId={processPack?.payload.id}
              UserID={userId}
              fullName={fullName}
              processPosition={processPack?.payload.position}
              isArci={true}
            />
          </ModalForFormsGreenBtn>
        </div>
      </div>
    </div>
  );
}
