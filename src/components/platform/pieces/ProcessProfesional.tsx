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
  const { data: institutionPack } = useInstitutionById(processPack?.payload?.user_id || null);




  const fullName = useFullName(profesionalPack?.payload?.profesional_data?.name, profesionalPack?.payload?.profesional_data?.last_name);
  return (
    <div>
      <div className='bg-gray-50 w-full rounded-sm p-2 grid grid-cols-[minmax(0,1fr)_auto] gap-1 shadow-xl mt-1 justify-between items-start'>
        <div className='min-w-0 pr-1.5 space-y-0.5'>
          <h2 className='text-(--main-arci) text-sm font-bold leading-tight break-words'>{fullName}</h2>
          <p className='text-xs text-(--orange-arci) break-words'>{institutionPack?.payload?.name || "Institución"}</p>
          <span className='text-xs text-gray-600 break-words'>{processPack?.payload.position}</span>
          <p className='text-xs font-light'>{formatDateToString(processPack?.payload.created_at)}</p>
        </div>
        <div className='controles grid gap-1 [&>*>button]:w-full'>
          {Boolean(profesionalPack?.payload?.profesional_data?.main_study?.isHomologated) && (
            <div className='badge badge-success badge-outline badge-xs w-fit justify-self-center'>Homologado UE</div>
          )}
          <ModalForPreview title='Ver Profesional' btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ProfesionalDetailFullById userId={userId} />
          </ModalForPreview>
          <ModalForPreview title='Ver Proceso' btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ProcessDetail processData={processPack?.payload} />
          </ModalForPreview>
          <ModalForFormsRedBtn title='Rechazar Solicitud' btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ConfirmDeleteProfesionalToProcessVictorForm ProcessId={processPack?.payload.id} UserID={userId} fullName={fullName} processPosition={processPack?.payload.position} />
          </ModalForFormsRedBtn>
          <ModalForFormsGreenBtn title='Aceptar Solicitud' btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
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
