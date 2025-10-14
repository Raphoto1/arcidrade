'use client'
import ModalForPreview from "@/components/modals/ModalForPreview";
import { useInstitutionById } from "@/hooks/usePlatInst";
import { useProfesionalById } from "@/hooks/usePlatPro";
import { useProcess } from "@/hooks/useProcess";
import { formatDateToString, useFullName } from "@/hooks/useUtils";
import React from "react";

import { FaStar } from "react-icons/fa";
import ProfesionalDetailFull from "./ProfesionalDetailFull";
import ProfesionalDetailFullById from "./ProfesionalDetailFullById";

export default function ProcessProfesional(props: any) {
  const processData = props.processData;
  const userId = props.userId;
  const { data: processPack } = useProcess(processData);
  const { data: profesionalPack } = useProfesionalById(userId);
  const { data: institutionPack } = useInstitutionById(processPack?.payload.user_id);
  console.log('processPack en ProcessProfesional', processPack);
  console.log('profesional pack', profesionalPack);
  console.log('institution pack', institutionPack);

  const fullName = useFullName(profesionalPack?.payload.profesional_data[0].name, profesionalPack?.payload.profesional_data[0].last_name);
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
          <button className='btn btn-wide bg-[var(--orange-arci)] text-sm h-auto'>Eliminar</button>
          <button className='btn bg-success h-auto text-sm'>Aceptar Proceso</button>
        </div>
      </div>
    </div>
  );
}
