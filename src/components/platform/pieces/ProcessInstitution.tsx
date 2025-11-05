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

export default function ProcessInstitution(props: any) {
  const process = props.process;
  const institution = useInstitutionById(process?.user_id);
  const institutionData = institution?.data?.payload || {};

  return (
    <div className='w-full'>
      <div className=' bg-gray-50 md:w-full rounded-sm p-2 grid grid-cols-2 gap-2 shadow-xl mt-2 justify-between items-center'>
        <div className='w-2/3'>
          <h3 className='text-sm text-(--orange-arci)'>{process.type === "arcidrade" && "Proceso Arcidrade"}</h3>
          <h2 className='text-(--main-arci) text-bold text-wrap font-bold'>{institutionData?.name}</h2>
          <p className='text-sm w-100 text-(--main-arci)'>{useHandleCategoryName(process?.area)||'No registrado'}</p>
          <p className='text-sm w-100 text-(--main-arci)'>{process?.position}</p>
          <span className='text-sm text-gray-600 w-100 capitalize'>{process?.main_speciality}</span>
          <p className='font-light'>{formatDateToString(process?.start_date)}</p>
        </div>
        <div className='controles grid justify-center gap-2 mt-4'>
          <ModalForPreview title='Detalle del Proceso'>
            <ProcessDetail processData={process} />
          </ModalForPreview>
          <ModalForFormsRedBtn title={"Eliminar Proceso"}>
            <ConfirmArchiveProcessForm id={process?.id} />
          </ModalForFormsRedBtn>
          <ModalForFormsGreenBtn title={"Aceptar Proceso"}>
            <ConfirmActivateProcessForm id={process.id} />
          </ModalForFormsGreenBtn>
          <ModalForForms title={"Solicitar Contacto"}>
            <ConfirmAskContactForm referCode={process?.user_id} name={institutionData?.name} />
          </ModalForForms>
        </div>
      </div>
    </div>
  );
}
