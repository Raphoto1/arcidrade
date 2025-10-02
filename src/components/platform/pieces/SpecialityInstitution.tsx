import React from "react";

// imports propios
import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";

import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";

import ProfesionalSpecialityUpdateForm from "@/components/forms/platform/profesional/ProfesionalSpecialityUpdateForm";

import { useInstitutionSpecializations } from "@/hooks/usePlatInst";
import ConfirmDeleteSpecialityInstitutionForm from "@/components/forms/platform/institution/ConfirmDeleteSpecialityInstitutionForm";
import InstitutionSpecialityUpdateForm from "@/components/forms/platform/institution/InstitutionSpecialityUpdateForm";

export default function SpecialityInstitution(props: any) {
  const { mutate } = useInstitutionSpecializations();
  const date = new Date(props.end_date);

  return (
    <div>
      <div className='bg-gray-50 w-full rounded-sm p-4 grid grid-cols-2 gap-4 shadow-xl mt-2 items-center'>
        {/* Información */}
        <div className='w-full'>
          <h2 className='text-[var(--main-arci)] font-bold text-lg'>{props.title || "Especialidad"}</h2>
          <p className='text-sm text-gray-800'>{props.title_category || "Categoría Universidad"}</p>
        </div>

        {/* Controles */}
        <div className='grid justify-center gap-0'>
          <ModalForFormsRedBtn title='Eliminar Especialidad'>
            <ConfirmDeleteSpecialityInstitutionForm id={props.id} />
          </ModalForFormsRedBtn>

          {/* <button
            className={`btn text-white text-sm h-auto ${props.is_main ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--main-arci)]"}`}
            disabled={props.is_main}
            onClick={handleMakeMain}>
            {props.is_main ? "Ya es Principal" : "Establecer como Principal"}
          </button> */}

          <ModalForFormsSoftBlue title='Actualizar'>
            <InstitutionSpecialityUpdateForm id={props.id} />
          </ModalForFormsSoftBlue>
        </div>
      </div>
    </div>
  );
}
