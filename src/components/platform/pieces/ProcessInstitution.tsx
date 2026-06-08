"use client";
import { useInstitutionById } from "@/hooks/usePlatInst";
import { formatDateToString } from "@/hooks/useUtils";
import ModalForPreview from "@/components/modals/ModalForPreview";
import ModalForFormsGreenBtn from "@/components/modals/ModalForFormsGreenBtn";
import ConfirmActivateProcessForm from "@/components/forms/platform/process/ConfirmActivateProcessForm";
import React from "react";

import { FaStar } from "react-icons/fa";
import ProcessDetail from "../process/ProcessDetail";
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmArchiveProcessForm from "@/components/forms/platform/process/ConfirmArchiveProcessForm";
import ModalForForms from "@/components/modals/ModalForForms";
import ConfirmAskContactForm from "@/components/forms/platform/victor/ConfirmAskContactForm";
import { useHandleCategoryName } from "@/hooks/useUtils";
import UpdateProcessForm from "@/components/forms/platform/process/UpdateProcessForm";

export default function ProcessInstitution(props: any) {
  const process = props.process;
  const onSuccess = props.onSuccess;
  const institution = useInstitutionById(process?.user_id);
  const institutionData = institution?.data?.payload || {};

  return (
    <div className='w-full'>
      <div className='bg-gray-50 md:w-full rounded-sm p-2 grid grid-cols-[minmax(0,1fr)_auto] gap-1 shadow-xl mt-1 justify-between items-start'>
        <div className='min-w-0 pr-1.5 space-y-0.5'>
          <h3 className='text-xs text-(--orange-arci)'>{process.type === "arcidrade" && "Proceso Arcidrade"}</h3>
          <h2 className='text-(--main-arci) text-sm font-bold leading-tight break-words'>{institutionData?.name}</h2>
          <p className='text-xs text-(--main-arci)'>{useHandleCategoryName(process?.area)||'No registrado'}</p>
          <p className='text-xs text-(--main-arci)'>{process?.position}</p>
          <span className='text-xs text-gray-600 capitalize'>{process?.main_speciality}</span>
          <p className='font-light'>{formatDateToString(process?.start_date)}</p>
        </div>
        <div className='controles grid justify-center gap-1 mt-0.5'>
          <ModalForPreview title='Detalle del Proceso'>
            <ProcessDetail processData={process} />
          </ModalForPreview>
          <ModalForForms title='Editar Proceso' btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <UpdateProcessForm id={process?.id} />
          </ModalForForms>
          <ModalForFormsRedBtn title={"Eliminar Proceso"} btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ConfirmArchiveProcessForm id={process?.id} onSuccess={onSuccess} />
          </ModalForFormsRedBtn>
          <ModalForFormsGreenBtn title={"Aceptar Proceso"} btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ConfirmActivateProcessForm id={process.id} onSuccess={onSuccess} />
          </ModalForFormsGreenBtn>
          <ModalForForms title={"Solicitar Contacto"} btnClassName='btn btn-xs h-auto w-full min-h-0 px-2 py-1 text-[11px] text-white'>
            <ConfirmAskContactForm referCode={process?.user_id} name={institutionData?.name} />
          </ModalForForms>
        </div>
      </div>
    </div>
  );
}
