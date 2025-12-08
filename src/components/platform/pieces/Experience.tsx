import React from "react";

import ModalForFormsRedBtn from "@/components/modals/ModalForFormsRedBtn";
import ConfirmDeleteExperienceForm from "@/components/forms/platform/profesional/ConfirmDeleteExperienceForm";
import ModalForFormsSoftBlue from "@/components/modals/ModalForFormsSoftBlue";
import ProfesionalExperienceUpdateForm from "@/components/forms/platform/profesional/ProfesionalExperienceUpdateForm";
import FileExperienceForm from "@/components/forms/platform/profesional/FileExperienceForm";

export default function Experience(props: any) {
  const date = new Date(props.end_date);
  const endDate = props.end_date ? date.getFullYear() : null;
  const date2 = new Date(props.start_date);
  const startDate = props.start_date ? date2.getFullYear() : null;
  return (
    <div>
      <div className=' bg-gray-50 w-auto min-w-full rounded-sm p-2 grid grid-cols-2 shadow-xl mt-2 items-center'>
        <div className='w-full'>
          <h2 className='text-(--main-arci) text-bold text-nowrap font-bold'>{props.title || "cargo"}</h2>
          <span className='text-sm text-gray-600 w-100'>{props.institution || "Institución"}</span>
          <div className='font-light flex justify-start'>
            <span className='text-sm text-gray-600 w-100'>Ciudad: {props.city || "Ciudad"}</span>
          </div>
          <p className='font-light text-sm'>
            {startDate || null}-{endDate || "Activo"}
          </p>
          <h4>Respaldo</h4>
          <div className='w-full'>
            <h3>Descripcion:</h3>
            <p className='text-sm min-w-full font-extralight'>{props.description || "Descripción"}</p>
          </div>
        </div>
        <div className='controles w-auto grid justify-end gap-2'>
          <ModalForFormsRedBtn title='Eliminar Experiencia'>
            <ConfirmDeleteExperienceForm id={props.id} />
          </ModalForFormsRedBtn>
          <ModalForFormsSoftBlue title='Agregar Respaldo'>
            <FileExperienceForm id={props.id} />
          </ModalForFormsSoftBlue>
          <ModalForFormsSoftBlue title='Actualizar'>
            <ProfesionalExperienceUpdateForm id={props.id} />
          </ModalForFormsSoftBlue>
        </div>
      </div>
    </div>
  );
}
